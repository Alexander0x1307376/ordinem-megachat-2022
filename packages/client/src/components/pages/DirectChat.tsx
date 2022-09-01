import React from "react";
import { IoChevronBackOutline } from "react-icons/io5";
import { Link, useLocation, useParams } from "react-router-dom";
import { useUserContactQuery } from "../../features/contacts/contactsService";
import ChatSection from "../shared/ChatSection";
import Header from "../shared/Header";
import LoadingSpinner from "../shared/LoadingSpinner";



/**
 * компонент страницы прямого чата с контактом 
 */
const DirectChat: React.FC = () => {

  const location: any = useLocation();
  const { chatId } = useParams();
  const { data: contactData, isLoading: isContactLoading } = useUserContactQuery(chatId || '');
  let previousPath = location.state?.previousPath || "/contacts";

  return (
    <div className="h-screen flex flex-col">
      <Header
        title="Чат с User 1"
        leftContent={
          <Link className="p-2" to={previousPath}><IoChevronBackOutline size="1.5rem" /></Link>
        }
      />
    {contactData && !isContactLoading
    ? <ChatSection chatRoomUuid={contactData.chatRoomUuid || ''} />
    : <LoadingSpinner />}
    </div>
  )
}

export default DirectChat;