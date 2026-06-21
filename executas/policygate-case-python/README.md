# PolicyGate Case Executa

Python stdio Executa for the PolicyGate Anna app.

It exposes one JSON-RPC tool method, `case`, with action-based dispatch:

- `analyze_case`
- `policy_search`
- `risk_check`
- `draft_reply`
- `save_case`
- `approve_action`
- `export_audit`
- `get_state`

State is persisted locally at `~/.anna/policygate/state.json`. Audit exports
are written under `~/.anna/policygate/audits/`.

`analyze_case` and `draft_reply` use Anna host LLM sampling through Executa
reverse RPC (`sampling/createMessage`). The Executa declares
`host_capabilities: ["llm.sample"]`, so Anna grants the model path when the app
runs through `anna-app dev` or after it is published.

No OpenAI key is required. The standalone bridge can still smoke-test the UI;
when it runs outside Anna and cannot negotiate host sampling, the Executa uses a
deterministic local draft fallback. `policy_search`, `risk_check`, `save_case`,
`approve_action`, `export_audit`, and `get_state` are deterministic local tool
actions.

This tool records approval decisions only. It does not send messages or execute
external side effects.
