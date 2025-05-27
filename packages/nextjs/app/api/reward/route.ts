import { NextRequest, NextResponse } from "next/server";
import { createConfig, http } from "@wagmi/core";
import { writeContract } from "@wagmi/core";
import { sepolia } from "@wagmi/core/chains";
import "dotenv/config";
import { privateKeyToAccount } from "viem/accounts";
import { financeAbi } from "~~/utils/abis/financeAbi";

const config = createConfig({
  chains: [sepolia],
  transports: {
    [sepolia.id]: http(),
  },
});

const account = privateKeyToAccount((process.env.PRIVATE_KEY_MIGUEL as `0x${string}`) || "0x0");

export const GET = async (request: NextRequest) => {
  const place = request.nextUrl.searchParams.get("place");
  const host = request.headers.get("host");
  console.log("host", host, "place", place);

  if (host !== "https://ship-games-nextjs.vercel.app/") {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  try {
    await writeContract(config, {
      abi: financeAbi,
      address: "0x1f396B60e1EC1F3356f9080E78be3dF003B8Ab93",
      account: account,
      functionName: "grantReward",
      args: ["0xD2692F9df925D18D527ABe8b3d99EE9E9C8d75AE", 1n, 1n],
    });
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    console.log(err);
    return NextResponse.error();
  }
};
