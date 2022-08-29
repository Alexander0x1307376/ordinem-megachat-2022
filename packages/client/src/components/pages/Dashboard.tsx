import React, { useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { BASE_API_URL } from "../../config";
import ModalWindow from "../layouts/ModalWindow";
import AcceptDeclineMessage from "../shared/AcceptDeclineMessage";
import ActionItem from "../shared/ActionItem";
import FramerModal from "../shared/FramerModal";
import AddFriendPanel from "../shared/AddFriendPanel";
import AccountWidget from "../widgets/AccountWidget";
import { GiBootKick } from "react-icons/gi";
import { useLocation } from "react-router-dom";
import UserItem from "../shared/UserItem";
import { 
  useAcceptRequestMutation, 
  useDeclineRequestMutation, 
  useFriendRequestsQuery, 
  useRecallRequestMutation 
} from "../../features/friendshipSystem/friendRequestsService";
import { useFriendsQuery, useRemoveFriendMutation } from "../../features/users/usersService";
import { useAppSelector } from "../../store/utils/hooks";
import { selectUsersData } from "../../features/users/usersDataSlice";
import { has } from "lodash";


const Dashboard: React.FC = () => {

  const location = useLocation();

  // запросы дружбы через api
  const { data: requests } = useFriendRequestsQuery();
  
  const [acceptFriendRequest] = useAcceptRequestMutation();
  const [declineFriendRequest] = useDeclineRequestMutation();
  const [recallFriendRequest] = useRecallRequestMutation();
  const [removeFriend] = useRemoveFriendMutation();


  // модалка поиска и добавления друга
  const [isAddFriendModalOpen, setIsAddFriendModalOpen] = useState<boolean>(false);
  const handleCloseAddFriendModal = () => {
    setIsAddFriendModalOpen(false);
  }


  const handleRecallFriendRequest = async (uuid: string) => {
    await recallFriendRequest(uuid);
  }
  const handleAcceptFriendRequest = async (uuid: string) => {
    await acceptFriendRequest(uuid);
  }
  const handleDeclineFriendRequest = async (uuid: string) => {
    await declineFriendRequest(uuid);
  }

  // непосредственно друзья
  const {data: friends} = useFriendsQuery();

  const removeFriendRequest = async (friendUuid: string) => {
    await removeFriend(friendUuid);
  }

  const usersData = useAppSelector(selectUsersData);


  return (<>

    {/* Модальное окно поиска друзей */}
    <FramerModal isOpen={isAddFriendModalOpen} onOutlineClick={handleCloseAddFriendModal}>
      <ModalWindow isAutoSize title="Добавить в друзья" onClose={handleCloseAddFriendModal}>
        <AddFriendPanel onRequestSent={handleCloseAddFriendModal} />
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
                onAcceptClick={() => handleAcceptFriendRequest(uuid)}
                onDeclineClick={() => handleDeclineFriendRequest(uuid)}
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
                onActionClick={() => handleRecallFriendRequest(uuid)}
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
            {friends?.map(({uuid, name, avaPath}) => {

              return <UserItem 
                key={uuid}
                uuid={uuid}  
                avaPath={avaPath ? BASE_API_URL + avaPath : undefined}
                name={name}
                status={
                  has(usersData, uuid)
                  ? usersData[uuid].status
                  : 'не в сети'
                }
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