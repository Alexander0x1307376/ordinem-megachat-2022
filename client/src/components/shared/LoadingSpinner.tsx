import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


export interface LoadingSpinnerProps {
  size?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({size = '5rem'}) => {
  return (
    <AiOutlineLoading3Quarters className="animate-spin" size={size} />
  )
}

export default LoadingSpinner;