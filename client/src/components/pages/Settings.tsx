import React from "react";
import InputOptions from "../shared/InputOptions";
import InputSwitch from "../shared/InputSwitch";

const Settings: React.FC = () => {
  

  return (
    <div className="flex flex-col">
      <div className="bg-glassy rounded-lg p-4 mb-2">
        <h2 className="font-bold mb-2">Блок настроек 1</h2>
        <div className="w-72">
          <form onSubmit={(event) => {
            event.preventDefault();
            const data = new FormData(event.target as HTMLFormElement);
            console.log(Object.fromEntries(data.entries()));
          }}>
            <div className="flex items-center mb-2">
              <span className="grow">Настройка</span>
              <InputSwitch name="set1" />
            </div>
            <div className="flex items-center mb-2">
              <span className="grow">Настройка</span>
              <InputSwitch name="set2" />
            </div>
            <div className="flex items-center mb-2">
              <span className="grow">Настройка</span>
              <InputSwitch name="set3" />
            </div>
            <div className="flex items-center mb-2">
              <span className="grow">Настройка</span>
              <InputOptions name="options" options={[
                { key: '001', name: 'atata', value: 1914 },
                { key: '002', name: 'Bebebe', value: 'bebe' },
                { key: '003', name: 'cec', value: 'cec' },
              ]} />
            </div>
            <div>
              <button type="submit">Отправить</button>
            </div>
          </form>
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