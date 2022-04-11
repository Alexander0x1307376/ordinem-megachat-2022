import React from "react";
import GroupItem from "../shared/GroupItem";



const groupData = [
  {
    name: 'Тестовая группа',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 2',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 3',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
  {
    name: 'Тестовая группа 4',
    description: 'Описание группы'
  },
]

const Groups: React.FC = () => {

  return (
    <div>
      <div className="flex flex-col">

        {groupData.map(({name, description}, index) => (

          <GroupItem 
            key={index}
            name={name} 
            description={description} 
            imageUrl="https://i.pravatar.cc/150?img=60"
          />

        ))}

      </div>
    </div>
  )
}

export default Groups;