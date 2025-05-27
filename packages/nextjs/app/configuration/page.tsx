"use client";

import { useEffect, useState } from "react";
import { NextPage } from "next";
import { formatEther, parseEther } from "viem";
import { useAccount } from "wagmi";
import DialogOnlyAdmin from "~~/components/DialogOnlyAdmin";
import { IntegerInput } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Configuration: NextPage = () => {
  const { address } = useAccount();

  //states
  const [first, setFirst] = useState<string>("");
  const [second, setSecond] = useState<string>("");
  const [third, setThird] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);

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

  //effects
  useEffect(() => {
    setFirst(formatEther(firstReward ?? 0n).toString() ?? "");
    setSecond(formatEther(secondReward ?? 0n).toString() ?? "");
    setThird(formatEther(thirdReward ?? 0n).toString() ?? "");
  }, [firstReward, secondReward, thirdReward]);

  useEffect(() => {
    if (!showToast) return;
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  }, [showToast]);

  //functions
  const handleUpdate = async () => {
    setLoading(true);
    try {
      await writeFinanceAsync({
        functionName: "updateRewards",
        args: [parseEther(first), parseEther(second), parseEther(third)],
      });

      setShowToast(true);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="flex flex-col justify-center items-center h-full w-full">
      {address !== owner ? (
        <DialogOnlyAdmin />
      ) : (
        <section className="w-full px-2 md:px-0 mx-auto">
          {/* card */}
          <article className="card card-border bg-base-100 sm:w-8/12 md:w-7/12 lg:w-5/12 mt-6 mx-auto">
            <div className="card-body justify-center items-center">
              <h2 className="card-title text-2xl">Place Reward</h2>
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

              <article className="gap-5 w-full flex flex-col">
                <div className="flex-1 w-full">
                  <p className="my-1 text-center sm:text-start sm:ms-4 font-semibold">First Place Reward</p>
                  <IntegerInput
                    value={first}
                    onChange={updatedTxValue => {
                      setFirst(updatedTxValue);
                    }}
                    placeholder="value (ETH)"
                    disableMultiplyBy1e18
                  />
                </div>

                <div className="flex-1 w-full">
                  <p className="my-1 text-center sm:text-start sm:ms-4 font-semibold">Second Place Reward</p>
                  <IntegerInput
                    value={second}
                    onChange={updatedTxValue => {
                      setFirst(updatedTxValue);
                    }}
                    placeholder="value (ETH)"
                    disableMultiplyBy1e18
                  />
                </div>

                <div className="flex-1 w-full">
                  <p className="my-1 text-center sm:text-start sm:ms-4 font-semibold">First Place Reward</p>
                  <IntegerInput
                    value={third}
                    onChange={updatedTxValue => {
                      setFirst(updatedTxValue);
                    }}
                    placeholder="value (ETH)"
                    disableMultiplyBy1e18
                  />
                </div>
                <div className="card-actions justify-center">
                  <button
                    className="btn btn-primary w-full sm:w-60"
                    onClick={handleUpdate}
                    disabled={
                      loading ||
                      !/^[0-9]+(\.[0-9]+)?$/.test(first) ||
                      !/^[0-9]+(\.[0-9]+)?$/.test(second) ||
                      !/^[0-9]+(\.[0-9]+)?$/.test(third)
                    }
                  >
                    {loading ? "Updating..." : "Update second place"}
                  </button>
                </div>
              </article>
            </div>
          </article>
        </section>
      )}
    </section>
  );
};

export default Configuration;
