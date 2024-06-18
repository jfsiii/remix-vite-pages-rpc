import { type AppLoadContext } from '@remix-run/cloudflare';
import { M } from 'node_modules/vite/dist/node/types.d-aGj9QkWt';
import { type PlatformProxy } from "wrangler";
import { NamedEntrypoint as RpcWorker  } from "./workers/rpc-worker/index";
// When using `wrangler.toml` to configure bindings,
// `wrangler types` will generate types for those bindings
// into the global `Env` interface.
// Env is from ./worker-configuration.d.ts (created by `wrangler types` or `npm run typegen`)


// If left as Env, the RPC worker only shows fetch & connect methods; not those it actually has
interface Env2 extends Env {
  MY_RPC: Service<RpcWorker>;
}

type Cloudflare = Omit<PlatformProxy<Env2>, "dispose">;


declare module '@remix-run/cloudflare' {
  interface AppLoadContext {
    cloudflare: Cloudflare;
    extra: string; // augmented
  }
}

type GetLoadContext = (args: {
  request: Request;
  context: { cloudflare: Cloudflare }; // load context _before_ augmentation
}) => AppLoadContext;

// Shared implementation compatible with Vite, Wrangler, and Cloudflare Pages
export const getLoadContext: GetLoadContext = ({ context }) => {
  return {
    ...context,
    extra: 'stuff',
  };
};
