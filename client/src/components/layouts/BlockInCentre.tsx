import React from "react";

export interface BlockInCentre {
  children: React.ReactNode;
}

const BlockInCentre: React.FC<BlockInCentre> = ({children}) => {
  return (
    <div className="
      block
      w-full h-full md:flex md:items-center md:justify-center
    ">
      <div className="
        bg-glassy rounded-none w-full h-full p-4
        md:rounded-lg md:w-96 md:h-auto
      ">
        {children}
      </div>
    </div>
  )
}

export default BlockInCentre;