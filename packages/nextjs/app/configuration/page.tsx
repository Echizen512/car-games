import { NextPage } from "next";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";

const Configuration: NextPage = () => {
  return (
    <dialog id="my_modal_1" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg">Hello!</h3>
        <p className="py-4">Connect your wallet</p>
        <div className="modal-action justify-center">
          <RainbowKitCustomConnectButton />
        </div>
      </div>
    </dialog>
  );
};

export default Configuration;
