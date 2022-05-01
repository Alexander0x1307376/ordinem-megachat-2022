import React from "react";
import { IoCheckmarkSharp, IoCloseSharp } from "react-icons/io5";
import AcceptDeclineMessage from "../shared/AcceptDeclineMessage";
import ActionItem from "../shared/ActionItem";
import Button from "../shared/Button";
import AccountWidget from "../widgets/AccountWidget";


const friendRequests = [
  {
    uuid: '001',
    name: 'Vasya'
  },
  {
    uuid: '002',
    name: 'Petya'
  },
  {
    uuid: '003',
    name: 'Kolya'
  },
  {
    uuid: '004',
    name: `Abdul Abraham ibnHattab de San Huan Ab'Akan`
  },
  {
    uuid: '005',
    name: 'Алексей Выкторович Крякопузько'
  },
];

const yourFriendRequests = [
  {
    uuid: '006',
    name: 'Biba'
  },
  {
    uuid: '007',
    name: 'Boba'
  },
  {
    uuid: '008',
    name: 'Pussy Destroyeer Pussy Destroyeer Pussy Destroyeer'
  },
]

const Dashboard: React.FC = () => {
  return (<>

    <div className="p-4">
      <AccountWidget />
    </div>

    <div className="flex flex-wrap flex-col md:flex-row px-4">
      <div className="md:basis-1/2 md:flex-1 md:even:pl-2 md:odd:pr-2 pb-4">
        
        <div className="rounded-lg bg-bglighten h-full w-full p-4">
          <div className="flex">
            <h2 className="grow font-semibold pb-4">Запросы дружбы ({friendRequests.length})</h2>
          </div>
          <div className="space-y-4">
            {friendRequests.map(({uuid, name}) => (
              <AcceptDeclineMessage key={uuid} 
                message={`${name}: запрос дружбы`} 
              />
            ))}
          </div>
        </div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-bglighten h-full w-full p-4">
          <h2 className="font-semibold pb-4">Ваши запросы дружбы</h2>
          <div className="space-y-4">
            {yourFriendRequests.map(({uuid, name}) => (
              <ActionItem
                key={uuid}
                message={name}
                buttonText='отозвать запрос'
                buttonIcon={IoCloseSharp}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-bglighten h-full w-full p-4">Блок</div>
      </div>
    </div>
  </>)
}

export default Dashboard;