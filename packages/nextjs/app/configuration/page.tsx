"use client";

import { useState } from "react";
import { NextPage } from "next";
import { formatEther } from "viem";
import { useAccount } from "wagmi";
import DialogOnlyAdmin from "~~/components/DialogOnlyAdmin";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Configuration: NextPage = () => {
  const { address } = useAccount();

  //states
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Smart contract
  const { data: owner } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "owner",
  });

  const { data: firstReward } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "firstPlaceReward",
  });

  const { data: secondReward } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "secondPlaceReward",
  });

  const { data: thirdReward } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "thirdPlaceReward",
  });

  const { writeContractAsync: writeFinanceAsync } = useScaffoldWriteContract({ contractName: "Finance" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await writeFinanceAsync({
        functionName: "updateRewards",
        args: [BigInt(first), BigInt(second), BigInt(third)],
      });
      setMessage("Rewards updated successfully ✅");
    } catch (err) {
      console.log(err);
      setMessage("Error updating rewards ❌");
    }

    setLoading(false);
  };

  return (
    <section className="flex flex-col justify-center items-center h-full w-full">
      {address !== owner ? (
        <DialogOnlyAdmin />
      ) : (
        <div className="card card-border bg-base-100 w-4/12 mt-6">
          <div className="card-body justify-center items-center">
            <h2 className="card-title">Place Reward</h2>
            <div className="mb-4">
              <p>
                <strong>Actual First Place Reward:</strong> {formatEther(firstReward ?? 0n)}RKS
              </p>
              <p>
                <strong>Actual Second Place Reward:</strong> {formatEther(secondReward ?? 0n)}RKS
              </p>
              <p>
                <strong>Actual Third Place Reward:</strong> {formatEther(thirdReward ?? 0n)}RKS
              </p>
            </div>

            <form onSubmit={handleSubmit} className="gap-5 w-full flex flex-col">
              <div>
                <label className="ms-2">First Place Reward</label>
                <IntegerInput
                  value={first}
                  onChange={updatedTxValue => {
                    setFirst(updatedTxValue);
                  }}
                  placeholder="value (wei)"
                />
              </div>

              <div>
                <label className="ms-2">Second Place Reward</label>
                <IntegerInput
                  value={second}
                  onChange={updatedTxValue => {
                    setSecond(updatedTxValue);
                  }}
                  placeholder="value (wei)"
                />
              </div>

              <div>
                <label className="ms-2">Third Place Reward</label>
                <IntegerInput
                  value={third}
                  onChange={updatedTxValue => {
                    setThird(updatedTxValue);
                  }}
                  placeholder="value (wei)"
                />
              </div>

              <div className="card-actions justify-center">
                <button className="btn btn-primary" disabled={loading} type="submit">
                  {loading ? "Updating..." : "Update Rewards"}
                </button>
              </div>
            </form>
          </div>
        </div>

        // <div className="card p-6 shadow-lg rounded-lg bg-primary mt-6">
        //   <h1 className="text-2xl font-bold mb-4 text-center">Configuration</h1>

        //   <div className="mb-4">
        //     <p>
        //       <strong>Actual First Place Reward:</strong> {firstReward?.toString()}
        //     </p>
        //     <p>
        //       <strong>Actual Second Place Reward:</strong> {secondReward?.toString()}
        //     </p>
        //     <p>
        //       <strong>Actual Third Place Reward:</strong> {thirdReward?.toString()}
        //     </p>
        //   </div>

        //   {message && <p className="mt-4 text-green-500">{message}</p>}
        // </div>
      )}
    </section>
  );
};

export default Configuration;
