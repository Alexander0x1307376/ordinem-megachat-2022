import React, { FormEvent, useState } from "react";
import { IoAdd, IoEllipsisVertical } from "react-icons/io5";
import GroupItem from "../shared/GroupItem";
import PopoverButton from "../shared/PopoverButton";
import FramerModal from "../shared/FramerModal";
import ButtonInlineText from "../shared/ButtonInlineText";
import Header from "../shared/Header";
import CreateGroupForm from "../forms/CreateGroupForm";
import { BASE_API_URL } from "../../config";
import LoadingSpinner from "../shared/LoadingSpinner";
import NotificationWidget from "../features/notifications/NotificationWidget";
import ModalWindow from "../layouts/ModalWindow";
import { 
  useCreateGroupMutation, useUserGroupsQuery 
} from "../../features/groups/groupsService";


const Groups: React.FC = () => {

  const handleOpenCreateGroup = () => {
    setIsModalOpen(true);
  }

  const popoverMenuItems = [
    {
      key: 'createGroup',
      title: 'Создать новую группу',
      icon: IoAdd,
      onClick: handleOpenCreateGroup
    }
  ];

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const handleCloseModal = () => { setIsModalOpen(false); }

  const [createGroup, {isLoading: isCreateGroupLoading}] = useCreateGroupMutation();
  const { 
    isLoading: isUserGroupsDataLoading, 
    data: userGroupsData
  } = useUserGroupsQuery({});

  const handleCreateGroup = async (event: FormEvent<HTMLFormElement>, formData: FormData) => {
    event.preventDefault();
    const postData = Object.fromEntries(formData.entries());
    try {
      const result = await createGroup(postData).unwrap();
      console.log(result);
      setIsModalOpen(false);
    } catch (e) {
      console.error(e);
    }
  }

  return (<>
    <FramerModal isOpen={isModalOpen} onOutlineClick={handleCloseModal}>
      <ModalWindow
        onClose={handleCloseModal}
        title="Создать группу"
      >
        <CreateGroupForm onSubmit={handleCreateGroup} />

      </ModalWindow>
    </FramerModal>
    <div className="flex flex-col h-full">
      <Header {...{
        title: 'Группы',
        rightContent: (<div className="flex space-x-2">
          <NotificationWidget />
          <PopoverButton
            icon={IoEllipsisVertical}
            menuOptions={popoverMenuItems}
          />
        </div>)
      }} />
      <div className="grow w-full h-full bg overflow-y-auto">

        {!(userGroupsData?.groupsWhereOwner.length && userGroupsData?.groupsWhereMember.length) && (
          <div className="text-center text-textSecondary p-4">
            Вы не состоите ни в одной группе. Дождитесь приглашения или &nbsp;
            <ButtonInlineText onClick={handleOpenCreateGroup} text="создайте свою" />
          </div>
        )}
        
        {isUserGroupsDataLoading 
        ? (
          <div className="flex flex-col items-center text-textSecondary">
            <LoadingSpinner />
            <span className="mt-4 ">Загрузка...</span>
          </div>
        )
        : (<>

          {userGroupsData?.groupsWhereOwner.length !== 0 && (
            <div className="flex flex-col px-4">
              <h2 className="text-textSecondary">Ваши группы</h2>
              <div className="space-y-4 py-4">
                {userGroupsData?.groupsWhereOwner.map(({ uuid, name, description, avaUrl }: any) => (
                  <GroupItem
                    key={uuid}
                    name={name}
                    link={`/group/${uuid}`}
                    description={description}
                    imageUrl={avaUrl ? BASE_API_URL + avaUrl : undefined}
                  />
                ))}
              </div>
            </div>
          )}
        
          {userGroupsData?.groupsWhereMember.length !== 0 && (
            <div className="flex flex-col px-4">
              <h2 className="text-textSecondary">Группы, где вы состоите</h2>
              <div className="space-y-4 py-4">

                {userGroupsData?.groupsWhereMember.map(({ uuid, name, description, avaUrl }: any) => (
                  <GroupItem
                    key={uuid}
                    name={name}
                    link={`/group/${uuid}`}
                    description={description}
                    imageUrl={avaUrl ? BASE_API_URL + avaUrl : undefined}
                  />
                ))}
                
              </div>
            </div>
          )}
        </>)}
        
      </div>
    </div>
  </>)
}

export default Groups;