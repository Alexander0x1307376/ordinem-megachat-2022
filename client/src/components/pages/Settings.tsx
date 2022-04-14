import React, { useRef, useState } from "react";

const Settings: React.FC = () => {

  const [check, setCheck] = useState<any>();
  const checkInput = useRef();


  return (
    <div className="flex flex-col">
      <div className="bg-glassy rounded-lg p-4 mb-2">
        <h2 className="font-bold mb-2">Блок настроек 1</h2>
        <div>
          <p>Настройка 1</p>
          <p>Настройка 2</p>
          <p>Настройка 3</p>
        </div>
      </div>

      <div className="bg-glassy rounded-lg p-4 mb-2">
        <h2 className="font-bold mb-2">Блок настроек 1</h2>
        <div>
          <p>Настройка 1</p>
          <p>Настройка 2</p>
          <p>Настройка 3</p>
        </div>
      </div>
    </div>
  )
}

export default Settings;