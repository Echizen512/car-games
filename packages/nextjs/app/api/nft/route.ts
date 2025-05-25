import { type NextRequest } from "next/server";
import "dotenv/config";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const address = searchParams.get("address");

    const req = await fetch(
      `https://api.opensea.io/api/v2/chain/ronin/account/${address}/nfts?collection=ronkeships-nft&limit=200`,
      {
        method: "GET",
        headers: {
          "content-Type": "application/json",
          "x-api-key": process.env.OPEN_SEA_KEY || "",
        },
      },
    );
    const res = await req.json();
    return Response.json(res);
  } catch (err) {
    console.log(err);
    return Response.error();
  }
}
