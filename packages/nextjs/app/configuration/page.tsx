"use client";

import { NextPage } from "next";
import { useState } from "react";
import { useAccount } from "wagmi";
import DialogOnlyAdmin from "~~/components/DialogOnlyAdmin";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

const Configuration: NextPage = () => {
  const { address } = useAccount();

  // Obtener el propietario del contrato
  const { data: owner } = useScaffoldReadContract({
    contractName: "Finance",
    functionName: "owner",
  });

  // Obtener recompensas actuales
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

  // Función para actualizar recompensas
  const { writeAsync: updateRewards } = useScaffoldWriteContract({
    contractName: "Finance",
    functionName: "updateRewards",
  });

  // Estado para los nuevos valores
  const [first, setFirst] = useState("");
  const [second, setSecond] = useState("");
  const [third, setThird] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await updateRewards({
        args: [BigInt(first), BigInt(second), BigInt(third)],
      });
      setMessage("Rewards updated successfully ✅");
    } catch (error) {
      setMessage("Error updating rewards ❌");
    }

    setLoading(false);
  };

  return (
    <section className="flex flex-col justify-center items-center">
      {address !== owner ? (
        <DialogOnlyAdmin />
      ) : (
        <div className="card p-6 shadow-lg rounded-lg bg-primary mt-6">
          <h1 className="text-2xl font-bold mb-4 text-center">Configuration</h1>

          <div className="mb-4">
            <p><strong>Actual First Place Reward:</strong> {firstReward?.toString()}</p>
            <p><strong>Actual Second Place Reward:</strong> {secondReward?.toString()}</p>
            <p><strong>Actual Third Place Reward:</strong> {thirdReward?.toString()}</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <label>First Place Reward</label>
            <input
              type="number"
              value={first}
              onChange={(e) => setFirst(e.target.value)}
              className="border rounded p-2"
            />

            <label>Second Place Reward</label>
            <input
              type="number"
              value={second}
              onChange={(e) => setSecond(e.target.value)}
              className="border rounded p-2"
            />

            <label>Third Place Reward</label>
            <input
              type="number"
              value={third}
              onChange={(e) => setThird(e.target.value)}
              className="border rounded p-2"
            />

            <button
              type="submit"
              className="mt-4 bg-secondary text-white p-2 rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update Rewards"}
            </button>
          </form>

          {message && <p className="mt-4 text-green-500">{message}</p>}
        </div>
      )}
    </section>
  );
};

export default Configuration;
