import React from "react";


export interface InputTextProps {
  name: string;
  label: string;
  required?: boolean;
  htmlType?: 'text' | 'password' | 'email';
  value?: string;
}

const InputText: React.FC<InputTextProps> = ({ 
  name, label, required, htmlType = 'text', value 
}) => {
  return (
    <div className="flex flex-col mt-4">
      {label && <label className="mb-2 text-textSecondary" htmlFor={name}>{label}</label>}
      <input 
        defaultValue={value}
        className="px-4 py-2 rounded-lg bg-bglighten outline-none" 
        id={name} name={name} required={required} type={htmlType}
      />
    </div>  
  )
}

export default InputText;