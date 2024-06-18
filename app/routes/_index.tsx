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
  const resultA = await MY_SERVICE_A.fetch("http://0.0.0.0");

  // see https://github.com/cloudflare/workers-sdk/blob/5d3d12f75769f022629ace3aa402941889551d5a/fixtures/get-platform-proxy/tests/get-platform-proxy.env.test.ts#L199-L205
  // using `using counter` instead of `const counter` means
  // 1) `npm run dev` (remix w/vite for dev server) will fail with "TypeError: Object not disposable"
  // 2) `npm run build && npm run start` (remix/vite/rollup to build & wrangler for dev server) is required
  // using counter = await MY_RPC.getCounter();
  const counter = await MY_RPC.getCounter();
  console.log(await counter.value); // 0
  console.log(await counter.increment(4)); // 4
  console.log(await counter.increment(8)); // 12
  console.log(await counter.value); // 12

  // see https://github.com/cloudflare/workers-sdk/blob/5d3d12f75769f022629ace3aa402941889551d5a/fixtures/get-platform-proxy/tests/get-platform-proxy.env.test.ts#L194-L198
  // using jsonResp = await MY_RPC.asJsonResponse([1, 2, 3]);
  const jsonResp = await MY_RPC.asJsonResponse([1, 2, 3]);


  // see https://github.com/cloudflare/workers-sdk/blob/5d3d12f75769f022629ace3aa402941889551d5a/fixtures/get-platform-proxy/tests/get-platform-proxy.env.test.ts#L206-L223
  // const helloWorldFn = await MY_RPC.getHelloWorldFn();
  // const helloFn = await MY_RPC.getHelloFn();

  // // Shows:
  // // {
  // //   helloWorldFn: ProxyStub { name: 'RpcStub', poisoned: false },
  // //   helloFn: ProxyStub { name: 'RpcStub', poisoned: false }
  // // }
  // console.log({ helloWorldFn, helloFn })

  // const helloWorldResult = helloWorldFn(); // TypeError: helloWorldFn is not a function
  // const helloResult = helloFn("Sup", "world", {
  //   capitalize: true,
  //   suffix: "?!",
  // })
  // console.log({ helloWorldResult, helloResult })
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
    rpc: {
      lastCounter: await counter.value,
      jsonStatus: jsonResp.status,
      jsonResponse: await jsonResp.text(),
      sum: await MY_RPC.sum([1, 2, 3]),
    },
    serviceA: await resultA.text(),

    // helloWorldResult,
    // helloResult,
  });
};

export default function Index() {
  const {env, extra, rpc, serviceA} = useLoaderData<typeof loader>()
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
      <h2 className="text-2xl mt-4">Result(s) of calling Service/RPC methods</h2>
      <pre className="mt-4 p-4 bg-gray-100 rounded-md">
        {JSON.stringify({
          serviceA,
          rpc,
          }, null, 2)}
      </pre>
    </div>
  );
}
