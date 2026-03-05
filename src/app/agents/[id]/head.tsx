import { getAgentById } from "@/lib/agents";

interface Props {
  params: { id: string };
}

export default async function Head({ params }: Props) {
  const agent = getAgentById(params.id);
  const title = agent ? `${agent.name} — AI Voice Agent` : "AI Voice Agent";
  const description = agent?.description ?? "AI voice agent experience.";

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </>
  );
}
