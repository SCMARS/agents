"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Agent, CallStatus } from "@/lib/types";

const ParticleCanvas = dynamic(() => import("./ParticleCanvas"), { ssr: false });

interface VoiceWidgetProps {
  agent: Agent;
}

const STATUS_LABELS: Record<CallStatus, string> = {
  idle: "Ready to talk",
  connecting: "Connecting...",
  active: "Call active",
  speaking: "Listening...",
};

const STATUS_COLORS: Record<CallStatus, string> = {
  idle: "bg-purple-500",
  connecting: "bg-orange-400",
  active: "bg-cyan-400",
  speaking: "bg-pink-400",
};

const ACCENT_COLORS: Record<CallStatus, string> = {
  idle: "#a855f7",
  connecting: "#fb923c",
  active: "#22d3ee",
  speaking: "#f472b6",
};

export default function VoiceWidget({ agent }: VoiceWidgetProps) {
  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providerARef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const providerBRef = useRef<any>(null);

  const stopCall = useCallback(async () => {
    if (providerARef.current) {
      providerARef.current.stop();
      providerARef.current = null;
    }
    if (providerBRef.current) {
      await providerBRef.current.endSession();
      providerBRef.current = null;
    }
    setStatus("idle");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCall();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startProviderACall = useCallback(async () => {
    if (!agent.providerA) return;
    try {
      const Vapi = (await import("@vapi-ai/web")).default;
      const vapi = new Vapi(agent.providerA.publicKey);
      providerARef.current = vapi;

      vapi.on("call-start", () => setStatus("active"));
      vapi.on("call-end", () => setStatus("idle"));
      vapi.on("speech-start", () => setStatus("speaking"));
      vapi.on("speech-end", () => setStatus("active"));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      vapi.on("error", (e: any) => {
        console.error("[VoiceProviderA] error:", e);
        setError("Connection error. Please try again.");
        setStatus("idle");
      });

      setStatus("connecting");
      await vapi.start(agent.providerA.assistantId);
    } catch (e) {
      console.error(e);
      setError("Failed to start call.");
      setStatus("idle");
    }
  }, [agent.providerA]);

  const startProviderBCall = useCallback(async () => {
    if (!agent.providerB) return;

    const agentId = agent.providerB.agentId;
    console.log("[VoiceProviderB] agentId:", agentId);

    if (!agentId) {
      setError("Agent ID not configured. Check provider B environment variables in .env.local");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (e) {
      console.error("[VoiceProviderB] mic error:", e);
      setError("Microphone access denied. Please allow microphone in browser settings.");
      return;
    }

    setStatus("connecting");

    try {
      const { Conversation } = await import("@elevenlabs/client");

      const conversation = await Conversation.startSession({
        agentId,
        connectionType: "websocket",
        dynamicVariables: agent.providerB?.dynamicVariables,
        onConnect: () => {
          console.log("[VoiceProviderB] connected");
          setStatus("active");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onDisconnect: (details: any) => {
          console.log("[VoiceProviderB] disconnected", details);
          setStatus("idle");
        },
        onError: (msg: string) => {
          console.error("[VoiceProviderB] error:", msg);
          setError(`Error: ${msg}`);
          setStatus("idle");
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onModeChange: (mode: any) => {
          const m = typeof mode === "object" ? mode.mode : mode;
          console.log("[VoiceProviderB] mode:", m);
          if (m === "speaking") setStatus("speaking");
          else setStatus("active");
        },
      });

      providerBRef.current = conversation;
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      console.error("[VoiceProviderB] session error:", e);
      setError(`Connection failed: ${msg}`);
      setStatus("idle");
    }
  }, [agent.providerB]);

  const handleToggle = useCallback(async () => {
    setError(null);
    if (status !== "idle") {
      await stopCall();
      return;
    }
    if (agent.provider === "providerA") {
      await startProviderACall();
    } else {
      await startProviderBCall();
    }
  }, [status, agent.provider, startProviderACall, startProviderBCall, stopCall]);

  const isActive = status !== "idle";
  const accent = ACCENT_COLORS[status];

  return (
    <div
      className="relative flex flex-col items-center justify-between w-full max-w-sm mx-auto rounded-3xl overflow-hidden p-6 gap-6"
      style={{
        background: "radial-gradient(ellipse at top, rgba(30,10,60,0.95) 0%, rgba(5,5,20,0.98) 100%)",
        boxShadow: `0 0 60px 0 ${accent}22, 0 8px 48px 0 rgba(0,0,0,0.7)`,
        backdropFilter: "blur(16px) saturate(140%)",
        border: `1px solid ${accent}33`,
        transition: "box-shadow 0.6s ease, border-color 0.6s ease",
        minHeight: 480,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-3 w-full">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-xl"
          style={{ background: `${accent}22`, border: `1px solid ${accent}55` }}
        >
          🎙️
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold text-sm truncate">{agent.name}</p>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`w-2 h-2 rounded-full ${STATUS_COLORS[status]} ${isActive ? "animate-pulse" : ""}`}
          />
          <span className="text-white/50 text-xs">{STATUS_LABELS[status]}</span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative w-full flex-1 rounded-2xl overflow-hidden" style={{ minHeight: 240 }}>
        <ParticleCanvas status={status} />
      </div>

      {/* Description */}
      <p className="text-white/40 text-xs text-center px-2 leading-relaxed">{agent.description}</p>

      {/* Error */}
      {error && (
        <div
          className="w-full rounded-xl px-4 py-2 text-xs text-red-300 text-center"
          style={{ background: "rgba(255,50,50,0.1)", border: "1px solid rgba(255,50,50,0.2)" }}
        >
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="w-full">
        <button
          onClick={handleToggle}
          disabled={status === "connecting"}
          className="relative w-full py-3 rounded-2xl font-semibold text-sm text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
          style={{
            background: isActive
              ? `linear-gradient(135deg, rgba(239,68,68,0.2), rgba(220,38,38,0.15))`
              : `linear-gradient(135deg, ${accent}33, ${accent}22)`,
            border: `1px solid ${isActive ? "rgba(239,68,68,0.4)" : `${accent}55`}`,
            boxShadow: `0 0 20px 0 ${isActive ? "rgba(239,68,68,0.15)" : `${accent}22`}`,
          }}
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            {status === "connecting" ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                Connecting...
              </>
            ) : isActive ? (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" rx="1" />
                  <rect x="14" y="4" width="4" height="16" rx="1" />
                </svg>
                End Call
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10a1 1 0 0 0-2 0 5 5 0 0 1-10 0 1 1 0 0 0-2 0 7 7 0 0 0 6 6.93V19H9a1 1 0 0 0 0 2h6a1 1 0 0 0 0-2h-2v-2.07A7 7 0 0 0 19 10z" />
                </svg>
                Start Talking
              </>
            )}
          </span>
        </button>
      </div>

      {/* Tags */}
      {agent.tags && agent.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 justify-center w-full">
          {agent.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-full text-xs text-white/40"
              style={{ background: `${accent}15`, border: `1px solid ${accent}25` }}
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
