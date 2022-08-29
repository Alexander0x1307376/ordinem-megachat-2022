import { has } from "lodash";
import React from "react";
import { IoEllipsisVertical, IoPersonAddSharp } from "react-icons/io5";
import { useUserContactsQuery } from "../../features/contacts/contactsService";
import { selectUsersData } from "../../features/users/usersDataSlice";
import { useAppSelector } from "../../store/utils/hooks";
import ListWithHeader from "../layouts/ListWithHeader";
import ContactItem from "../shared/ContactItem";
import LoadingSpinner from "../shared/LoadingSpinner";
import PopoverButton from "../shared/PopoverButton";



const Contacts: React.FC = () => {


  const popoverMenuItems = [
    {
      key: 'setContact',
      title: 'Начать чат с чуваком или чувихой',
      icon: IoPersonAddSharp,
      onClick: () => {}
    }
  ];

  const {data: contacts, isLoading: isContactsLoading } = useUserContactsQuery();
  const usersData = useAppSelector(selectUsersData);


  return (
    <ListWithHeader
      headerProps={{
        title: 'Контакты',
        rightContent: (
          <PopoverButton
            icon={IoEllipsisVertical}
            menuOptions={popoverMenuItems}
          />
        )
      }}
    >
      {isContactsLoading? (
        <div>
          <LoadingSpinner size="2rem" />
        </div>
      ): (
        contacts?.directChats?.map((item) => (
          <ContactItem
            key={item.uuid}
            name={item.contactor.name}
            link={`/chat/${item.uuid}`}
            description={
              has(usersData, item.contactor.uuid)
                ? usersData[item.contactor.uuid].status
                : 'не в сети'
            }
          />
        ))
      )}
    </ListWithHeader>
  )
}

export default Contacts;