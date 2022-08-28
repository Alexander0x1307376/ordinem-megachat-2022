import React, { useMemo } from "react";
import stc from "string-to-color";
import Ava from "./Ava";

export interface AvaOrLetterProps {
  imageUrl?: string; 
  text: string;
}

const AvaOrLetter: React.FC<AvaOrLetterProps> = ({
  imageUrl, text
}) => {


  const backgroundColor = useMemo(() => !imageUrl ? stc(text) : undefined, [imageUrl, text]);

  return (
    <div>
      {
        imageUrl
        ? <Ava imageUrl={imageUrl} />
        : (
          <div className="h-10 w-10 rounded-full flex items-center justify-center ava-status" style={{backgroundColor}}>
            <span className="font-medium text-lg">{text[0]}</span>
          </div>
        )
      }
    </div>
  )
}

export default AvaOrLetter;