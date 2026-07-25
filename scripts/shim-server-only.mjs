// Lets Node CLI scripts (sync:github, tests) import server-only modules.
// The "server-only" package throws outside a React Server environment; this
// hook resolves it to an empty stub for local tooling ONLY. Next.js builds
// never load this shim, so the client-bundle guarantee stands.
import { registerHooks } from "node:module";

const stubUrl = new URL("./server-only-stub.cjs", import.meta.url).href;

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier === "server-only") {
      return { shortCircuit: true, url: stubUrl };
    }
    return nextResolve(specifier, context);
  },
});
