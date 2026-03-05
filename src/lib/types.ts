export type AgentProvider = "providerA" | "providerB";

export type CallStatus = "idle" | "connecting" | "active" | "speaking";

export interface ProviderAConfig {
  publicKey: string;
  assistantId: string;
}

export interface ProviderBConfig {
  agentId: string;
  dynamicVariables?: Record<string, string | number | boolean>;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  provider: AgentProvider;
  providerA?: ProviderAConfig;
  providerB?: ProviderBConfig;
  accentColor?: string;
  tags?: string[];
}
