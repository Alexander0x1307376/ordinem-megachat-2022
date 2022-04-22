import React from "react";
import ContactItem from "../shared/ContactItem";


const contactsData = [
  {
    uuid: '001',
    name: 'Пользователь 1',
    description: 'Статус'
  },
  {
    uuid: '002',
    name: 'Вася',
    description: 'Статус'
  },
  {
    uuid: '003',
    name: 'Петя',
    description: 'Статус'
  },
  {
    uuid: '004',
    name: 'Pussy Destroyer',
    description: 'Статус'
  },
  {
    uuid: '005',
    name: 'Abrahan Abdul Ibn`Hattab de San-Paulo',
    description: 'Статус'
  },
];

const Contacts: React.FC = () => {
  return (
    <div>
      <div className="flex flex-col space-y-4">

        {contactsData.map(({ name, description, uuid }, index) => (

          <ContactItem
            key={index}
            name={name}
            link={`/chat/${uuid}`}
            description={description}
            imageUrl="https://i.pravatar.cc/150?img=60"
          />

        ))}

      </div>
    </div>
  )
}

export default Contacts;