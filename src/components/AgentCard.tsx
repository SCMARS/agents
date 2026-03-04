"use client";

import Link from "next/link";
import { Agent } from "@/lib/types";

interface AgentCardProps {
  agent: Agent;
}

const PROVIDER_COLORS: Record<string, string> = {
  vapi: "#22d3ee",
  elevenlabs: "#a855f7",
};

export default function AgentCard({ agent }: AgentCardProps) {
  const accent = PROVIDER_COLORS[agent.provider] ?? "#22d3ee";

  return (
    <Link href={`/agents/${agent.id}`} className="block group">
      <div
        className="relative rounded-2xl p-5 transition-all duration-300 cursor-pointer"
        style={{
          background: "rgba(15, 5, 40, 0.85)",
          border: `1px solid ${accent}25`,
          boxShadow: `0 4px 24px 0 rgba(0,0,0,0.4)`,
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Hover glow overlay */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
          style={{ background: `radial-gradient(ellipse at top left, ${accent}12 0%, transparent 70%)` }}
        />

        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: `${accent}18`, border: `1px solid ${accent}35` }}
            >
              🎙️
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm leading-tight">{agent.name}</h3>
            </div>
          </div>

          <div className="flex items-center gap-1.5 pt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-white/30 text-xs">online</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-white/50 text-xs leading-relaxed mb-4 line-clamp-2">
          {agent.description}
        </p>

        {/* Tags */}
        {agent.tags && agent.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {agent.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 rounded-full text-xs text-white/35"
                style={{ background: `${accent}12`, border: `1px solid ${accent}22` }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* CTA */}
        <div
          className="flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-medium transition-all duration-300 group-hover:opacity-100"
          style={{
            background: `${accent}18`,
            border: `1px solid ${accent}30`,
            color: accent,
          }}
        >
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
          </svg>
          Talk to agent
        </div>
      </div>
    </Link>
  );
}
