import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { BASE_API_URL } from "../../config";
import ModalWindow from "../layouts/ModalWindow";
import AcceptDeclineMessage from "../shared/AcceptDeclineMessage";
import ActionItem from "../shared/ActionItem";
import FramerModal from "../shared/FramerModal";
import UserSearchPanel from "../shared/UserSearchPanel";
import AccountWidget from "../widgets/AccountWidget";
import { GiBootKick } from "react-icons/gi";
import { useLocation } from "react-router-dom";
import UserItem from "../shared/UserItem";
import { useFriendsQuery, useRemoveFriendMutation } from "../../store/services/usersService";
import { useSelector } from "react-redux";
import { selectFriendRequests } from "src/features/socketMessageSystem/messageSystemSlice";

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

  const requests = useSelector(selectFriendRequests);
  console.log('requests', requests);

  const recallFriendRequest = (uuid: string) => {
    // recallRequest(uuid);
  }
  const acceptFriendRequest = (uuid: string) => {
    // acceptRequest(uuid);
  }
  const declineFriendRequest = (uuid: string) => {
    // declineRequest(uuid);
  }

  // непосредственно друзья
  const { data: friends, isLoading: areFriendsLoading } = useFriendsQuery({});
  const [removeFriend, {isLoading: isFriendRemoving}] = useRemoveFriendMutation();
  const removeFriendRequest = (friendUuid: string) => {
    console.log(friendUuid);
    removeFriend(friendUuid);
  }


  // навигация
  const location = useLocation();


  return (<>

    {/* Модальное окно поиска друзей */}
    <FramerModal isOpen={isAddFriendModalOpen} onOutlineClick={handleCloseAddFriendModal}>
      <ModalWindow title="Добавить друга" onClose={handleCloseAddFriendModal}>
        <UserSearchPanel onRequestSent={handleCloseAddFriendModal} />
      </ModalWindow>
    </FramerModal>

    <div className="p-4">
      <AccountWidget />
    </div>

    <div className="flex flex-wrap flex-col md:flex-row px-4">
      <div className="md:basis-1/2 md:flex-1 md:even:pl-2 md:odd:pr-2 pb-4">
        
        <div className="rounded-lg bg-bglighten h-full w-full p-4">
          <div className="flex pb-4">
            <h2 className="grow font-semibold">Запросы дружбы</h2>
          </div>
          <div className="space-y-4">
            {requests?.requestsToUser.length 
            
            ? requests.requestsToUser.map(({ uuid, requesterName }: any) => (
              <AcceptDeclineMessage key={uuid} 
                message={`${requesterName}: запрос дружбы`} 
                onAcceptClick={() => acceptFriendRequest(uuid)}
                onDeclineClick={() => declineFriendRequest(uuid)}
              />
            ))

            : <p className="text-textSecondary">сейчас нет запросов дружбы</p>
          }
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
            {requests?.userRequests.length
            ? requests?.userRequests.map(({ uuid, requestedName }: any) => (
              <ActionItem
                key={uuid}
                message={requestedName}
                buttonText='отозвать запрос'
                buttonIcon={IoCloseSharp}
                onActionClick={() => recallFriendRequest(uuid)}
              />
            ))
            : <p className="text-textSecondary">нет активных запросов</p>
 
          }
          </div>
        </div>
      </div>


      <div className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4">
        <div className="rounded-lg bg-bglighten h-full w-full">
          <div className="flex p-4">
            <h2 className="grow font-semibold">Друзья</h2>
          </div>
          <div className="px-2 pb-2 space-y-2">
            {friends?.map(({uuid, name, avaPath}: any) => (

              <UserItem 
                key={uuid}
                uuid={uuid}  
                avaPath={BASE_API_URL + avaPath}
                name={name}
                status={'status'}
                link={`/chat/${uuid}`}
                routeState={{ previousPath: location.pathname }}
                options={[{
                  key: 'kickOut',
                  title: 'удалить из друзей',
                  icon: GiBootKick,
                  onClick: () => removeFriendRequest(uuid)
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