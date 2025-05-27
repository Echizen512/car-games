import Link from "next/link";
import { NextPage } from "next";
import { ArrowUturnLeftIcon } from "@heroicons/react/24/outline";

const DialogOnlyAdmin: NextPage = () => {
  return (
    <dialog id="my_modal_1" className="modal" open>
      <div className="modal-box">
        <h3 className="font-bold text-lg text-center">Atention! ⚠</h3>
        <p className="py-4 text-center">This section is exclusively for administrators. </p>
        <div className="modal-action justify-center">
          <Link href="/">
            <button className="btn btn-primary gap-2 justify-center">
              <ArrowUturnLeftIcon className="w-4 h-4 text-white" />
              Back
            </button>
          </Link>
        </div>
      </div>
    </dialog>
  );
};

export default DialogOnlyAdmin;
