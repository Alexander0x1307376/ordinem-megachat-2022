import React from "react";
import { IoAdd, IoEllipsisVertical } from "react-icons/io5";
import ListWithHeader from "../layouts/ListWithHeader";
import GroupItem from "../shared/GroupItem";
import PopoverButton from "../shared/PopoverButton";



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
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    uuid: '006',
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    uuid: '007',
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    uuid: '008',
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    uuid: '009',
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
]

const Groups: React.FC = () => {


  const popoverMenuItems = [
    {
      key: 'createGroup',
      title: 'Создать новую группу',
      icon: IoAdd
    }
  ];

  return (
    <ListWithHeader
      headerProps={{
        title: 'Группа',
        rightContent: (
          <PopoverButton
            icon={IoEllipsisVertical}
            menuOptions={popoverMenuItems}
          />
        )
      }}
    >
      {groupData.map(({uuid, name, description}, index) => (

        <GroupItem
          key={index}
          name={name}
          link={`/group/${uuid}`}
          description={description}
          imageUrl="https://i.pravatar.cc/150?img=60"
        />

      ))}
    </ListWithHeader>
  )
}

export default Groups;