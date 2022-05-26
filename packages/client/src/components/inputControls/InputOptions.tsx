import React from "react";

export interface InputOptionsProps {
  name: string;
  options: {
    key: string;
    name: string;
    value: string | number;
  }[]
}

const InputOptions: React.FC<InputOptionsProps> = ({options, name}) => {

  return (
    <select name={name} className="appearance-none w-28 bg-accented2 rounded-xl px-4 text-right">
      {
        options.map(({key, name, value}) => (
          <option key={key} value={value}>{name}</option>
        ))
      }
    </select>
  )
}

export default InputOptions;