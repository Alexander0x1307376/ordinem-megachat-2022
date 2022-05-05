import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { BASE_API_URL } from "../../config";
import { useAcceptRequestMutation, useDeclineRequestMutation, useFriendRequestsQuery, useRecallRequestMutation } from "../../store/services/friendRequestsService";
import ModalWindow from "../layouts/ModalWindow";
import AcceptDeclineMessage from "../shared/AcceptDeclineMessage";
import ActionItem from "../shared/ActionItem";
import FramerModal from "../shared/FramerModal";
import UserSearchPanel from "../shared/UserSearchPanel";
import AccountWidget from "../widgets/AccountWidget";
import { GiBootKick } from "react-icons/gi";
import { useLocation, useNavigate } from "react-router-dom";
import UserItem from "../shared/UserItem";

const friends = [
  {
    uuid: '001',
    name: 'Vasya',
    avaPath: 'https://i.pravatar.cc/150?img=21',
    status: 'в сети'
  },
  {
    uuid: '002',
    name: 'Petya',
    avaPath: 'https://i.pravatar.cc/150?img=22',
    status: 'отошёл'
  },
  {
    uuid: '003',
    name: 'Kolya',
    avaPath: 'https://i.pravatar.cc/150?img=23',
    status: 'занят'
  },
  {
    uuid: '004',
    name: `Abdul Abraham ibnHattab de San Huan Ab'Akan`,
    avaPath: 'https://i.pravatar.cc/150?img=24',
    status: 'жызнь нужна пражыть как настаящий падонак еб вашу мать'
  },
  {
    uuid: '005',
    name: 'Алексей Выкторович Крякопузько',
    // avaPath: 'https://i.pravatar.cc/150?img=25',
    status: 'не беспокоить'
  },
];

const yourFriendRequests = [
  {
    uuid: '006',
    name: 'Biba',
    avaPath: 'https://i.pravatar.cc/150?img=7'    
  },
  {
    uuid: '007',
    name: 'Boba',
    avaPath: 'https://i.pravatar.cc/150?img=9'
  },
  {
    uuid: '008',
    name: 'Pussy Destroyeer Pussy Destroyeer Pussy Destroyeer',
    avaPath: 'https://i.pravatar.cc/150?img=10'
  },
];

const Dashboard: React.FC = () => {

  // модалка поиска и добавления друга
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);
  const handleCloseAddFriendModal = () => {
    setIsAddFriendModalOpen(false);
  }

  // запросы по работе с друзьями
  const { data, isLoading } = useFriendRequestsQuery({});
  const [recallRequest] = useRecallRequestMutation();
  const [acceptRequest] = useAcceptRequestMutation();
  const [declineRequest] = useDeclineRequestMutation();

  const recallFriendRequest = (uuid: string) => {
    recallRequest(uuid);
  }

  const acceptFriendRequest = (uuid: string) => {
    acceptRequest(uuid);
  }

  const declineFriendRequest = (uuid: string) => {
    declineRequest(uuid);
  }

  // навигация
  const navigate = useNavigate();
  const location = useLocation();
  const goToUserDialog = (uuid: string) => {
    navigate(`/chat/${uuid}`, { state: { previousPath: location.pathname} });
  }


  return (<>

    {/* Модальное окно поиска друзей */}
    <FramerModal isOpen={isAddFriendModalOpen} onOutlineClick={handleCloseAddFriendModal}>
      <ModalWindow title="Добавить друга" onClose={handleCloseAddFriendModal}>
        <UserSearchPanel />
      </ModalWindow>
    </FramerModal>

    <div className="p-4">
      <AccountWidget />
    </div>

    <div className="flex flex-wrap flex-col md:flex-row px-4">
      <div className="md:basis-1/2 md:flex-1 md:even:pl-2 md:odd:pr-2 pb-4">
        
        <div className="rounded-lg bg-bglighten h-full w-full p-4">
          <div className="flex pb-4">
            <h2 className="grow font-semibold">Запросы дружбы (999)</h2>
          </div>
          <div className="space-y-4">
            {data?.requestsToUser.map(({ uuid, requesterName }: any) => (
              <AcceptDeclineMessage key={uuid} 
                message={`${requesterName}: запрос дружбы`} 
                onAcceptClick={() => acceptFriendRequest(uuid)}
                onDeclineClick={() => declineFriendRequest(uuid)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-bglighten h-full w-full p-4">
          <div className="flex items-center pb-4">
            <h2 className="grow font-semibold">Ваши запросы дружбы</h2>
            <button 
              className="bg-bglighten2 hover:bg-glassydarken p-2 rounded"
              onClick={() => setIsAddFriendModalOpen(true)}
            >
              Добавить друга
            </button>
          </div>
          <div className="space-y-4">
            {data?.userRequests.map(({ uuid, requestedName }: any) => (
              <ActionItem
                key={uuid}
                message={requestedName}
                buttonText='отозвать запрос'
                buttonIcon={IoCloseSharp}
                onActionClick={() => recallFriendRequest(uuid)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-bglighten h-full w-full">
          <div className="flex p-4">
            <h2 className="grow font-semibold">Друзья</h2>
          </div>
          <div className="px-2 pb-2 space-y-2">
            {friends.map(({uuid, name, avaPath, status}: any) => (

              <UserItem 
                key={uuid}
                uuid={uuid}  
                avaPath={avaPath}
                name={name}
                status={status}
                onBlockClick={() => { goToUserDialog(uuid); }}
                options={[{
                  key: 'kickOut',
                  title: 'удалить из друзей',
                  icon: GiBootKick,
                  onClick: () => {
                    console.log('oprtion')
                  }
                }]}
              />

            ))}
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default Dashboard;