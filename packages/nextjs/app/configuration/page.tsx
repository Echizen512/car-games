"use client";

import { NextPage } from "next";

// import { useAccount } from "wagmi";
// import DialogOnlyAdmin from "~~/components/DialogOnlyAdmin";
// import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Configuration: NextPage = () => {
  // const { address } = useAccount();

  //smart contract
  // const { writeContractAsync: writeYourContractAsync } = useScaffoldWriteContract({
  //   contractName: "Finance",
  //   writeContractParams,
  // });

  const testing = async () => {
    const req = await fetch("api/reset-oil");
    const res = await req.json();

    console.log(res);
  };

  return (
    <section className="flex flex-col justify-center items-center">
      <button className="btn btn-primary" onClick={() => testing()}>
        write with God
      </button>
      {/* {address !== owner && <DialogOnlyAdmin />}

      <h1>Configuration</h1> */}
    </section>
  );
};

export default Configuration;
