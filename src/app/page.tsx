import AgentCard from "@/components/AgentCard";
import { agents } from "@/lib/agents";

export default function Home() {
  return (
    <main
      className="min-h-screen relative"
      style={{
        background:
          "radial-gradient(ellipse at 20% 20%, rgba(168,85,247,0.08) 0%, transparent 50%), radial-gradient(ellipse at 80% 80%, rgba(34,211,238,0.06) 0%, transparent 50%), #050510",
      }}
    >
      {/* Grid background */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.03) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs text-purple-400 mb-6"
            style={{ background: "rgba(168,85,247,0.1)", border: "1px solid rgba(168,85,247,0.2)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            AI Voice Agents
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Talk to your{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: "linear-gradient(135deg, #a855f7, #22d3ee)" }}
            >
              AI agents
            </span>
          </h1>

          <p className="text-white/40 text-base max-w-md mx-auto leading-relaxed">
            Choose an agent below and start a real-time voice conversation.
          </p>
        </div>

        {/* Agents grid */}
        {agents.length === 0 ? (
          <div className="text-center py-24 text-white/30">
            <p className="text-lg mb-2">No agents configured</p>
            <p className="text-sm">
              Add agents in <code className="text-purple-400">src/lib/agents.ts</code>
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent) => (
              <AgentCard key={agent.id} agent={agent} />
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
