import { Agent } from "./types";

export const agents: Agent[] = [
  {
    id: "anna-australia",
    name: "Anna Australia",
    description: "AI voice agent powered by ElevenLabs.",
    provider: "elevenlabs",
    elevenlabs: {
      agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID_ANNA ?? "",
      dynamicVariables: {
        PLATFORM_NAME: "Goldenreels",
        LANGUAGE: "english",
        BONUS_1_SPINS: "one hundred",
        BONUS_1_GAME: "Buffalo Power",
        BONUS_1_PROVIDER: "Playson",
        BONUS_1_WAGER: "x20",
        BONUS_1_BET_AMOUNT: "zero point two",
        BONUS_1_DEPOSIT_REQUIRED: "no",
        BONUS_2_PERCENT: "two hundred percent",
        BONUS_2_MIN_DEPOSIT: "twenty",
        BONUS_2_MAX_USD: "fifty",
        BONUS_2_MAX_EUR: "fifty",
        BONUS_2_MAX_AUD: "one hundred",
        BONUS_2_MAX_NZD: "one hundred",
        BONUS_2_WAGER: "x25",
        BONUS_2_CASHOUT_MULTIPLIER: "ten times from bonus amount",
        BONUS_ACTIVATION_PERIOD: "fourteen days",
        BONUS_ACTIVE_PERIOD: "thirty days after activation",
        BONUS_CURRENCIES: "USD",
        BONUS_LOCATION: "account profile → Bonuses tab → green Activate button",
      },
    },
    tags: ["australia"],
  },
  {
    id: "uzbek-bot",
    name: "Uzbek Bot",
    description: "AI voice agent speaking Uzbek, powered by Vapi.",
    provider: "vapi",
    vapi: {
      publicKey: process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY ?? "",
      assistantId: process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_UZ ?? "",
    },
    tags: ["uzbek"],
  },
];

export function getAgentById(id: string): Agent | undefined {
  return agents.find((a) => a.id === id);
}
