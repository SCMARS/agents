export type AgentProvider = "vapi" | "elevenlabs";

export type CallStatus = "idle" | "connecting" | "active" | "speaking";

export interface VapiConfig {
  publicKey: string;
  assistantId: string;
}

export interface ElevenLabsConfig {
  agentId: string;
  dynamicVariables?: Record<string, string | number | boolean>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  provider: AgentProvider;
  vapi?: VapiConfig;
  elevenlabs?: ElevenLabsConfig;
  accentColor?: string;
  tags?: string[];
}
