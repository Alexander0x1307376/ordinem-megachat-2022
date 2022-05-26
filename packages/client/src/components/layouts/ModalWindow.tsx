import React from "react";
import { IoClose } from "react-icons/io5";


export interface ModalWindowProps {
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  isAutoSize?: boolean;
}

const ModalWindow: React.FC<ModalWindowProps> = ({
  onClose, title, children, isAutoSize
}) => {

  const classes = `
    relative bg-fillmain rounded-none w-full h-full p-4
    md:rounded-lg overflow-hidden flex flex-col
    ${isAutoSize ? '' : ' md:w-[46rem] md:h-[calc(100vh-5rem)]'}
  `;



  return (
    <div className={classes}
    >
      <div className="flex mb-4">
        <div className="grow text-lg font-semibold">{title}</div>
        <button onClick={onClose}>
          <IoClose size={'2rem'} />
        </button>
      </div>
      <div className="w-full h-full overflow-y-hidden">
        {children}
      </div>
    </div>
  )
}

export default ModalWindow;