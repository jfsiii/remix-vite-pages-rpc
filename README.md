# remix-vite-pages-rpc
Example repo demonstrating using Workers RPC with Remix (vite) and the issues with explicit-resource-management

## Development
Start the workers
```sh
npm run dev:workers
```

Run the dev server:

```sh
npm run dev:remix
```

To run Wrangler (must have already run `npm run dev:workers`):

```sh
npm run build
npm run start
```

## Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.

## Deployment
First, build your app for production:

```sh
npm run build
```

Then, deploy your app to Cloudflare Pages:

```sh
npm run deploy
```

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
