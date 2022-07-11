import React from "react";


export interface InputTextAreaProps {
  name: string;
  label: string;
  required?: boolean;
  value?: string;
}

const InputTextArea: React.FC<InputTextAreaProps> = ({ 
  name, label, required, value
}) => {
  return (
    <div className="flex flex-col mt-4 h-full">
      {label && <label className="mb-2 text-textSecondary" htmlFor={name}>{label}</label>}
      <textarea 
        defaultValue={value}
        className="px-4 py-2 rounded-lg bg-bglighten outline-none h-full resize-none" 
        id={name} name={name} required={required}
      />
    </div>  
  )
}

export default InputTextArea;