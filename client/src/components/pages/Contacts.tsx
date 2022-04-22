import React from "react";
import { IoEllipsisVertical } from "react-icons/io5";
import ListWithHeader from "../layouts/ListWithHeader";
import ContactItem from "../shared/ContactItem";
import PopoverButton from "../shared/PopoverButton";


const contactsData = [
  {
    uuid: '001',
    name: 'Пользователь 1',
    description: 'В сети'
  },
  {
    uuid: '002',
    name: 'Вася',
    description: 'Оффлайн'
  },
  {
    uuid: '003',
    name: 'Петя',
    description: 'Шкерится'
  },
  {
    uuid: '004',
    name: 'Pussy Destroyer',
    description: 'Жызнь нужна пражыть как настаящий падонак'
  },
  {
    uuid: '005',
    name: 'Abrahan Abdul Ibn`Hattab de San-Paulo',
    description: 'Статус'
  },
];

const Contacts: React.FC = () => {
  return (
    <ListWithHeader
      headerProps={{
        title: 'Контакты',
        rightContent: (
          <PopoverButton
            icon={IoEllipsisVertical}
            menuOptions={[]}
          />
        )
      }}
    >
      {contactsData.map(({ name, description, uuid }, index) => (

        <ContactItem
          key={index}
          name={name}
          link={`/chat/${uuid}`}
          description={description}
          imageUrl="https://i.pravatar.cc/150?img=60"
        />

      ))}
    </ListWithHeader>
  )
}

export default Contacts;