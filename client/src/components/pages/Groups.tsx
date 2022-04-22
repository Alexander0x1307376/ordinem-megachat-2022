import React from "react";
import GroupItem from "../shared/GroupItem";



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

  return (
    <div>
      <div className="flex flex-col space-y-4">

        {groupData.map(({uuid, name, description}, index) => (

          <GroupItem 
            key={index}
            name={name} 
            link={`/group/${uuid}`}
            description={description} 
            imageUrl="https://i.pravatar.cc/150?img=60"
          />

        ))}

      </div>
    </div>
  )
}

export default Groups;