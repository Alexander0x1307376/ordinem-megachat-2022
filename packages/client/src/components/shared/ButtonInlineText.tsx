import React from "react";

export interface ButtonInlineTextProps {
  text: string;
  onClick: () => void;
}

const ButtonInlineText: React.FC<ButtonInlineTextProps> = ({ text, onClick}) => {
  return (
    <button className="inline hover:text-accented2 underline" onClick={onClick}>{text}</button>
  )
}

export default ButtonInlineText;