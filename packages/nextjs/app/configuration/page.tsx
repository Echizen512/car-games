"use client";

import { NextPage } from "next";
import { useAccount } from "wagmi";
import DialogOnlyAdmin from "~~/components/DialogOnlyAdmin";
import { useScaffoldReadContract } from "~~/hooks/scaffold-eth";

const Configuration: NextPage = () => {
  const { address } = useAccount();

  //smart contract
  const { data: owner } = useScaffoldReadContract({
    contractName: "RoninZodiacs",
    functionName: "owner",
  });

  return (
    <section>
      {address !== owner && <DialogOnlyAdmin />}

      <h1>Configuration</h1>
    </section>
  );
};

export default Configuration;
