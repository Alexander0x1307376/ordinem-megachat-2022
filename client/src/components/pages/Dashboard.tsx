import React from "react";
import AccountWidget from "../widgets/AccountWidget";


const Dashboard: React.FC = () => {
  return (<>

    <div className="pb-4">
      <AccountWidget />
    </div>

    <div className="flex flex-wrap flex-col md:flex-row">
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-glassy h-full w-full p-4">
          Какие-то данные
          <p>asdasd</p>
          <p>asdasd</p>
          <p>asdasd</p>
          <p>asdasd</p>
          <p>asdasd</p>
        </div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-glassy h-full w-full p-4">Блок</div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-glassy h-full w-full p-4">Блок</div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-glassy h-full w-full p-4">Блок</div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-glassy h-full w-full p-4">Блок</div>
      </div>
    </div>
  </>)
}

export default Dashboard;