import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { InputBase } from "./scaffold-eth";
import { NextPage } from "next";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";

type ModalRacePaymentProps = {
  setShowPaymentModal: Dispatch<SetStateAction<boolean>>;
};

const ModalRacePayment: NextPage<ModalRacePaymentProps> = ({ setShowPaymentModal }) => {
  //states
  const [ethAmount, setEthAmount] = useState<string>("5");

  //smart contract
  // const { writeContractAsync: writeFinanceAsync } = useScaffoldWriteContract({ contractName: "Finance" });

  //functions
  // const handlePayRace = async () => {
  //   try {
  //     await writeFinanceAsync({
  //       functionName: "raceStart",
  //       args: [nftID,rarity],
  //       value: parseEther("0.1"),
  //     });
  //   } catch (e) {
  //     console.error("Error setting greeting:", e);
  //   }
  // };

  //effects
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowPaymentModal(false);
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [setShowPaymentModal]);

  useEffect(() => {
    console.log(ethAmount);
  }, [ethAmount]);

  return (
    <>
      <dialog className="modal modal-bottom sm:modal-middle" open>
        <div className="modal-box">
          <h3 className="font-bold text-lg text-center">Race Entry Payment</h3>
          <p className="py-4 text-center">
            Set up your participation. Set the amount you want to pay and get ready to compete.
          </p>
          <div className="flex justify-center flex-col items-center gap-3">
            {/* <EtherInput value={ethAmount} onChange={setEthAmount} placeholder="Enter your amount" /> */}
            <div className="flex justify-center flex-col items-center w-full flex-1">
              <InputBase placeholder="Enter your amount" value={ethAmount} onChange={setEthAmount} />
              {(ethAmount === "" || parseInt(ethAmount) < 5) && (
                <p className="text-sm text-error font-bold m-0">The minimum amount is $5</p>
              )}
            </div>

            <h3 className="font-bold text-lg">OR</h3>

            <div className="w-full max-w-xs">
              <input
                type="range"
                min="5"
                max="50"
                value={ethAmount === "" ? 0 : ethAmount}
                className="range"
                step="5"
                onChange={e => setEthAmount(e.target.value)}
              />

              <div className="flex justify-between px-2.5 mt-2 text-xs">
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
                <span>|</span>
              </div>
              <div className="flex justify-between px-2.5 mt-2 text-xs">
                <span>5</span>
                <span>10</span>
                <span>20</span>
                <span>30</span>
                <span>40</span>
                <span>50</span>
              </div>
            </div>
          </div>

          <div className="modal-action justify-center">
            <button className="btn btn-primary">Start race!</button>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ModalRacePayment;
