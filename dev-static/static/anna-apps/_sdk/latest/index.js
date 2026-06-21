/**
 * Anna App SDK bridge for standalone local development.
 *
 * The Anna host and anna-app CLI harness serve the real SDK at this path.
 * This file is served only by dev-server.js.
 */
const RPC_URL = "/rpc";

async function rpcCall(toolId, method, args) {
  const res = await fetch(RPC_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool: toolId, method, args }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  const json = await res.json();
  if (json.error) throw new Error(json.error);
  return json.data || json;
}

const storage = new Map();

export class AnnaAppRuntime {
  static async connect() {
    const inst = new AnnaAppRuntime();
    await rpcCall("policygate-case", "case", { action: "get_state" });
    return inst;
  }

  tools = {
    invoke: async ({ tool_id, method, args }) => {
      return rpcCall(tool_id, method, args);
    },
  };

  storage = {
    get: async ({ key }) => {
      return storage.get(key) ?? null;
    },
    set: async ({ key, value }) => {
      storage.set(key, value);
    },
  };

  chat = {
    write_message: async () => {},
  };

  window = {
    set_title: async ({ title }) => {
      document.title = title;
    },
  };
}
