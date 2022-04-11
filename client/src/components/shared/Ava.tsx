import React from "react";

export interface AvaProps {
  imageUrl: string;
}

const Ava: React.FC<AvaProps> = ({imageUrl}) => {

  return (
    <div className="h-10 w-10 ava-status rounded-full drop-shadow-lg">
      <img 
        className="h-full w-full rounded-full" 
        src={imageUrl} 
        alt="Ava"  
      />
    </div>
  )
}

export default Ava;