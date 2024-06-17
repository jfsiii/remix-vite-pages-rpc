import { json, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    {
      name: "description",
      content: "Welcome to Remix on Cloudflare!",
    },
  ];
};

export const loader = async ({ context }: LoaderFunctionArgs) => {
  const { MY_JSON_VAR, MY_RPC, MY_SERVICE_A, MY_SERVICE_B,  MY_VAR, MY_VAR_A, } = context.cloudflare.env;
  console.log({ MY_JSON_VAR, MY_RPC, MY_SERVICE_A, MY_SERVICE_B,  MY_VAR, MY_VAR_A, })
  return json({
    extra: context.extra,
    env: {
      MY_JSON_VAR,
      MY_VAR,
      MY_VAR_A,
      MY_RPC: 'Cannot be serialized to JSON, but it is available in the context. See console.logs for more info.',
      MY_SERVICE_A: 'Cannot be serialized to JSON, but it is available in the context. See console.logs for more info.',
      MY_SERVICE_B: 'Cannot be serialized to JSON, but it is available in the context. See console.logs for more info.',
    },
  });
};

export default function Index() {
  const {env, extra} = useLoaderData<typeof loader>()
  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix on Cloudflare</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://developers.cloudflare.com/pages/framework-guides/deploy-a-remix-site/"
            rel="noreferrer"
          >
            Cloudflare Pages Docs - Remix guide
          </a>
        </li>
      </ul>
      <h2 className="text-2xl mt-4">Cloudflare Environment Variables</h2>
      <pre className="mt-4 p-4 bg-gray-100 rounded-md">
        {JSON.stringify(env, null, 2)}
      </pre>
      <h2 className="text-2xl mt-4">Other Remix Context</h2>
      <pre className="mt-4 p-4 bg-gray-100 rounded-md">
        {JSON.stringify({extra}, null, 2)}
      </pre>
    </div>
  );
}
