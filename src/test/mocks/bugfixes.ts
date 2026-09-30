export function info(...args: unknown[]) {
  void args;
  return undefined;
}

export function error(...args: unknown[]) {
  void args;
  return undefined;
}

let config = { agentKey: "", agentSecret: "" };

export function loadConfigFromEnv() {
  return {
    agentKey: process.env.BUGFIXES_AGENT_KEY ?? "",
    agentSecret: process.env.BUGFIXES_AGENT_SECRET ?? "",
  };
}

export function setDefaultConfig(value: typeof config) {
  config = value;
}

export function getDefaultConfig() {
  return config;
}

export function resetDefaultConfig() {
  config = { agentKey: "", agentSecret: "" };
}
