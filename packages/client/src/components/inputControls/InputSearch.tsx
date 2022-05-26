import React, { useState } from "react";


export interface InputSearchProps {
  name: string;
  label: string;
  required?: boolean;
  htmlType?: 'text' | 'password' | 'email';
  onSearchClick: (value: string) => void;
}

const InputSearch: React.FC<InputSearchProps> = ({
  name, label, required, htmlType = 'text', onSearchClick
}) => {

  const [ value, setValue ] = useState<string>('');

  return (
    <div className="flex flex-col w-full mt-4">
      {label && <label className="mb-2 text-textSecondary" htmlFor={name}>{label}</label>}
      
      <div className="flex">
        <input
          className="px-4 py-2 rounded-l-lg w-full bg-bglighten outline-none"
          id={name} 
          name={name} 
          required={required} 
          type={htmlType}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
        <button 
          className="px-4 py-2 rounded-r-lg bg-infoDarken"
          onClick={(e) => onSearchClick(value)}
        >
          Поиск
        </button>
      </div>

    </div>
  )
}

export default InputSearch;