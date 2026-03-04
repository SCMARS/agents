import { notFound } from "next/navigation";
import Link from "next/link";
import { getAgentById, agents } from "@/lib/agents";
import VoiceWidget from "@/components/VoiceWidget";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return agents.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const agent = getAgentById(id);
  if (!agent) return {};
  return {
    title: `${agent.name} — AI Voice Agent`,
    description: agent.description,
  };
}

export default async function AgentPage({ params }: Props) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) notFound();

  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center relative px-4 py-10"
      style={{
        background:
          "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.12) 0%, transparent 60%), radial-gradient(ellipse at 50% 100%, rgba(34,211,238,0.08) 0%, transparent 60%), #050510",
      }}
    >
      {/* Grid */}
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(168,85,247,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(168,85,247,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      {/* Back link */}
      <div className="relative z-10 w-full max-w-sm mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-white/40 hover:text-white/70 text-sm transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          All agents
        </Link>
      </div>

      {/* Widget */}
      <div className="relative z-10 w-full">
        <VoiceWidget agent={agent} />
      </div>

    </main>
  );
}
