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
import { useDispatch, useSelector } from "react-redux";
import { friendshipSystemActions as msActions, selectFriendRequests, selectFriendStatuses } from "../../features/socketMessageSystem/friendshipSystemSlice";

const requests = {
  userRequests: [
    {
      uuid: '001',
      requestedName: 'Vasya',
      avaPath: 'https://i.pravatar.cc/150?img=21',
    },
    {
      uuid: '002',
      requestedName: 'Petya',
      avaPath: 'https://i.pravatar.cc/150?img=22',
    },
    {
      uuid: '003',
      requestedName: 'Kolya',
      avaPath: 'https://i.pravatar.cc/150?img=23',
    },
    {
      uuid: '004',
      requestedName: `Abdul Abraham ibnHattab de San Huan Ab'Akan`,
      avaPath: 'https://i.pravatar.cc/150?img=24'
    },
  ],
  requestsToUser: [
    {
      uuid: '006',
      requesterName: 'Biba',
      avaPath: 'https://i.pravatar.cc/150?img=7'
    },
    {
      uuid: '007',
      requesterName: 'Boba',
      avaPath: 'https://i.pravatar.cc/150?img=9'
    },
    {
      uuid: '008',
      requesterName: 'Pussy Destroyeer Pussy Destroyeer Pussy Destroyeer',
      avaPath: 'https://i.pravatar.cc/150?img=10'
    },
  ]
}


const Dashboard: React.FC = () => {

  const dispatch = useDispatch();
  const location = useLocation();

  // запросы дружбы
  const requests = useSelector(selectFriendRequests);
  // статусы друзей
  const friendStatuses = useSelector(selectFriendStatuses);
  console.log('friendStatuses', friendStatuses);


  // модалка поиска и добавления друга
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);
  const handleCloseAddFriendModal = () => {
    setIsAddFriendModalOpen(false);
  }


  const recallFriendRequest = (uuid: string) => {
    dispatch(msActions.recallFriendRequest(uuid));
  }
  const acceptFriendRequest = (uuid: string) => {
    dispatch(msActions.acceptFriendRequest(uuid));
  }
  const declineFriendRequest = (uuid: string) => {
    dispatch(msActions.declineFriendRequest(uuid));
  }

  // непосредственно друзья
  const { data: friends, isLoading: areFriendsLoading } = useFriendsQuery({});
  const [removeFriend, {isLoading: isFriendRemoving}] = useRemoveFriendMutation();
  const removeFriendRequest = (friendUuid: string) => {
    console.log(friendUuid);
    removeFriend(friendUuid);
  }
  


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
            {requests?.incomingRequests.length 
            
            ? requests.incomingRequests.map(({ uuid, requester }) => (
              <AcceptDeclineMessage key={uuid} 
                message={`${requester.name}: запрос дружбы`} 
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
            {requests?.outcomingRequests.length
            ? requests?.outcomingRequests.map(({ uuid, requested }) => (
              <ActionItem
                key={uuid}
                message={requested.name}
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
            {friends?.map(({uuid, name, avaPath}: any) => {

              const status = friendStatuses?.[uuid] || undefined;

              return <UserItem 
                key={uuid}
                uuid={uuid}  
                avaPath={BASE_API_URL + avaPath}
                name={name}
                status={status?.status || 'не в сети'}
                link={`/chat/${uuid}`}
                routeState={{ previousPath: location.pathname }}
                options={[{
                  key: 'kickOut',
                  title: 'удалить из друзей',
                  icon: GiBootKick,
                  onClick: () => removeFriendRequest(uuid)
                }]}
              />

            })}
          </div>
        </div>
      </div>
    </div>
  </>)
}

export default Dashboard;