import React from "react";
import { IoPersonCircle } from "react-icons/io5";
import { BASE_API_URL } from "../../config";
import { useSendFriendRequestMutation } from "../../store/services/friendRequestsService";
import { useLazyUserSearchQuery } from "../../store/services/usersService";
import Ava from "../features/icons/Ava";
import InputSearch from "./InputSearch";
import LoadingSpinner from "./LoadingSpinner";

export interface UserSearchPanelProps {
  onRequestSent?: () => void;
}

const UserSearchPanel: React.FC<UserSearchPanelProps> = ({
  onRequestSent
}) => {

  const [searchUsers, { data: userSearch, isLoading }] = useLazyUserSearchQuery();
  const [sendFriendRequest, {}] = useSendFriendRequestMutation();

  const handleSearch = (value: string) => {
    if(value)
      searchUsers(value);
  }

  const handleSendFriendRequest = async (uuid: string) => {
    await sendFriendRequest(uuid);
    onRequestSent?.();
  }


  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div>
        <InputSearch label="Ник" name="friendSearch" onSearchClick={handleSearch} />
      </div>
      <div className="grow flex flex-col mt-4">
        <h2 className="text-textSecondary">Результаты поиска</h2>
        <div className="h-full relative">
          <div className="absolute w-full top-0 bottom-0 overflow-y-auto">

            {
              isLoading
              ? (
                <div className="flex justify-center items-center h-2/3">
                  <div className="flex flex-col items-center space-y-4">
                    <LoadingSpinner />
                    <span>загрузка...</span>
                  </div>
                </div>
              ) : (<>{
                userSearch?.length ? (
                  <div className="flex flex-wrap flex-col md:flex-row items-stretch pt-4">
                    {userSearch?.map(({ uuid, name, avaPath }: any) => (
                      <div key={uuid} className="md:basis-1/2 md:even:pl-2 md:odd:pr-2 pb-4 last:pb-0">
                        <button
                          onClick={() => {
                            handleSendFriendRequest(uuid) 
                          }}
                          className="rounded-lg bg-glassy p-4 w-full h-full 
                            flex items-center space-x-4"
                        >
                          <div className="grow-0">
                            {
                              avaPath
                                ? <Ava imageUrl={BASE_API_URL + avaPath} />
                                : <IoPersonCircle className="h-10 w-10" />
                            }
                          </div>
                          <div className="grow relative w-full h-full">
                            <div className="text-left absolute truncate top-[calc(50%-.75rem)] left-0 right-0">
                              {name}
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap flex-col md:flex-row items-stretch pt-4">
                    <p className="text-center w-full">нет пользователей с таким ником</p>
                  </div>
                )
              }</>)
            }
            
            
          </div>
        </div>
      </div>
    </div>
  )
} 

export default UserSearchPanel;