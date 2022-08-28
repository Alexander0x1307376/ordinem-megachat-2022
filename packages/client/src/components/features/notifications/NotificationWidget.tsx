import React, { useState } from "react";
import { IoNotificationsCircleOutline } from "react-icons/io5";
import ModalWindow from "../../layouts/ModalWindow";
import FramerModal from "../../shared/FramerModal";
import IconedButton from "../../shared/IconedButton";
import NotificationItem from "./NotificationItem";

const notifications = [
  {
    uuid: '001',
    title: 'Приложение обновлено!',
    content: 'Добавлена целая куча всяких ништяков, исправлены старые баги и доьавлены новые!'
  },
  {
    uuid: '002',
    title: 'Yasya: запрос дружбы',
    // iconPath: 'https://i.pravatar.cc/150?img=7',
    // yesNoActions: {
    //   onYes: () => { console.log('accept!') },
    //   onNo: () => { console.log('reject!') },
    // }
  },
  {
    uuid: '003',
    title: 'Кик из группы', 
    content: 'Вас выгнали из группы "Клуб любителей пощекотать очко". Причина: ты пидор',
    // iconPath: 'https://i.pravatar.cc/150?img=70'
  },
  {
    uuid: '004',
    title: 'Уведомление без картинки'
  }

]

const NotificationWidget: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  }

  return (<>
    <FramerModal isOpen={isModalOpen} onOutlineClick={handleCloseModal}>
      <ModalWindow
        onClose={handleCloseModal}
        title="Уведомления"
      >
        <div className="w-full h-full overflow-auto">

          <div className="space-y-2 flex flex-col">

            {notifications.map(({uuid, title, content}: any) => (
              <NotificationItem key={uuid} title={title} content={content}  />
            ))}

          </div>


        </div>
      </ModalWindow>
    </FramerModal>

    <div className="relative">
      <IconedButton icon={IoNotificationsCircleOutline} onClick={() => setIsModalOpen(true)}/>
      <span 
        className="
          absolute -top-1 -right-1 bg-info font-medium 
          text-sm rounded-full px-2 pointer-events-none"
      >
        99
      </span>
    </div>
  </>)
}

export default NotificationWidget;