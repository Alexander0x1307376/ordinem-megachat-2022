import React, { FormEvent, useState } from "react";
import { IoAdd, IoClose, IoEllipsisVertical } from "react-icons/io5";
import GroupItem from "../shared/GroupItem";
import PopoverButton from "../shared/PopoverButton";
import FramerModal from "../shared/FramerModal";
import ButtonInlineText from "../shared/ButtonInlineText";
import Header from "../shared/Header";
import CreateGroupForm from "../forms/CreateGroupForm";
import { useCreateGroupMutation, useUserGroupsQuery } from "../../store/services/groupsService";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { BASE_API_URL } from "../../config";

const groupData = [
  {
    uuid: '001',
    name: 'Тестовая группа',
    description: 'Описание группы'
  },
  {
    uuid: '002',
    name: 'Тестовая группа 2',
    description: 'Описание группы'
  },
  {
    uuid: '003',
    name: 'Тестовая группа 3',
    description: 'Описание группы'
  },
  {
    uuid: '004',
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    uuid: '005',
    name: 'Тестовая группа 5',
    description: 'Описание группы'
  },
  {
    uuid: '006',
    name: 'Тестовая группа 6',
    description: 'Описание группы'
  },
  {
    uuid: '007',
    name: 'Тестовая группа 7',
    description: 'Описание группы'
  }
]

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
  const { isLoading, data } = useUserGroupsQuery({});
  // console.log(data);

  const handleCreateGroup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    try {
      const result = await createGroup(data).unwrap();
      console.log(result);
      setIsModalOpen(false);
    } catch (e) {

    }
    // console.log(Object.fromEntries(data.entries()));
  }

  return (<>
    <FramerModal isOpen={isModalOpen} onOutlineClick={handleCloseModal}>
      <div className="relative bg-fillmain rounded-none w-full h-full p-4
        md:rounded-lg md:w-[46rem] md:h-[calc(100vh-5rem)] overflow-y-auto drop-shadow"
      >
        <div className="flex mb-4">
          <div className="grow text-lg font-semibold">Заголовок</div>
          <button onClick={handleCloseModal}>
            <IoClose size={'2rem'} />
          </button>
        </div>
        <CreateGroupForm onSubmit={handleCreateGroup} />
    </div>
    </FramerModal>
    <div className="flex flex-col h-full">
      <Header {...{
        title: 'Группа',
        rightContent: (
          <PopoverButton
            icon={IoEllipsisVertical}
            menuOptions={popoverMenuItems}
          />
        )
      }} />
      <div className="grow w-full h-full bg overflow-y-auto">

        {!(data?.groupsWhereOwner.length && data?.groupsWhereMember.length) && (
          <div className="text-center text-textSecondary p-4">
            Вы не состоите ни в одной группе. Дождитесь приглашения или &nbsp;
            <ButtonInlineText onClick={handleOpenCreateGroup} text="создайте свою" />
          </div>
        )}
        
        {isLoading 
        ? (
          <div className="flex flex-col items-center text-textSecondary">
            <AiOutlineLoading3Quarters className="animate-spin" size={'5rem'} />
            <span className="mt-4 ">Загрузка...</span>
          </div>
        )
        : (<>

          {data?.groupsWhereOwner.length && (
            <div className="flex flex-col px-4">
              <h2 className="text-textSecondary">Ваши группы</h2>
              <div className="space-y-4 py-4">
                {data?.groupsWhereOwner.map(({ uuid, name, description, avaUrl }: any, index: number) => (
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
        
          {data?.groupsWhereMember.length && (
            <div className="flex flex-col px-4">
              <h2 className="text-textSecondary">Группы, где вы состоите</h2>
              <div className="space-y-4 py-4">

                {data?.groupsWhereMember.map(({ uuid, name, description, avaUrl }: any, index: number) => (
                  <GroupItem
                    key={uuid}
                    name={name}
                    link={`/group/${uuid}`}
                    description={description}
                    imageUrl={BASE_API_URL + avaUrl}
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