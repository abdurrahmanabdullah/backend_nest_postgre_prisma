import { Dialog, DialogPanel, DialogTitle } from "@headlessui/react";
import { IoMdClose } from "react-icons/io";
import { FaFacebook } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaInstagramSquare } from "react-icons/fa";
import Link from "next/link";


interface DetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DetailModal: React.FC<DetailModalProps> = ({ isOpen, onClose }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 z-10 flex items-center justify-center p-4 bg-black/50">
        <DialogPanel className="max-w-md w-full bg-white p-6 rounded-xl shadow-md relative">
          <DialogTitle className="text-lg font-semibold text-black text-center">
            Share with..
          </DialogTitle>
          <div className="flex items-center justify-center gap-x-4 mt-4">
            <Link href="https://facebook.com"><FaFacebook className="text-blue-500 text-[28px]"/></Link>
            <Link href="https://x.com/"><FaSquareXTwitter className="text-[28px]"/></Link>
            <Link href="https://www.instagram.com/"><FaInstagramSquare className="text-[28px]"/></Link>
          </div>

          <button
            onClick={onClose}
            className="absolute right-2 top-2"
          >
            <IoMdClose className="size-5 text-black font-semibold"/>
          </button>
        </DialogPanel>
      </div>
    </Dialog>
  );
};

export default DetailModal;
