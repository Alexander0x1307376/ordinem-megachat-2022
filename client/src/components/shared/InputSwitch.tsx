import React, { useRef } from "react";

export interface InputSwitchProps {
  value?: boolean;
  onChange?: (value: boolean) => void;
  name: string;
}

const InputSwitch: React.FC<InputSwitchProps> = ({ value, onChange, name}) => {

  const checkbox = useRef(null);

  return (
    <label htmlFor={name} className="flex items-center cursor-pointer">
      <div className="relative">
        <input ref={checkbox} type="checkbox" id={name} name={name} className="sr-only" />
        <div className="dot bg-textPrimary absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition"></div>
        <div className="block w-10 h-6 rounded-full transition-colors duration-100"></div>
      </div>
    </label>
  )
}

export default InputSwitch;