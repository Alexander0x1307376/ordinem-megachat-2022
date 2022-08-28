import { ChannelPostData } from "@ordinem-megachat-2022/shared";
import React, { FormEvent, useState } from "react";
import { useRemoveChannelMutation, useUpdateChannelMutation } from "../../../features/channels/channelsService";
import CreateChannelForm from "../../forms/CreateChannelForm";
import ModalWindow from "../../layouts/ModalWindow";
import Button from "../../shared/Button";
import FramerModal from "../../shared/FramerModal";

export interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupUuid?: string;
  channelData: Partial<ChannelPostData & { uuid: string; }>
}

const EditChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen, onClose, groupUuid, channelData
}) => {


  const [isRemoveChannelModalOpen, setIsRemoveChannelModalOpen] = useState<boolean>(false);
  const [removeChannel] = useRemoveChannelMutation();

  const handleRemoveChannelModalClose = () => {
    setIsRemoveChannelModalOpen(false);
  };

  const handleRemoveChannelModalOpen = () => {
    setIsRemoveChannelModalOpen(true);
  };

  const handleRemoveChannel = async () => {
    if (!channelData.uuid) return;
    await removeChannel(channelData.uuid);
    handleRemoveChannelModalClose();
    onClose();
  }


  const [updateChannel] = useUpdateChannelMutation();
  const handleSubmitEditChannel = async (event: FormEvent<HTMLFormElement>) => {
    console.log('handleSubmitEditChannel');
    event.preventDefault();
    if (!(groupUuid && channelData.uuid)) return;
    const data = new FormData(event.target as HTMLFormElement);
    try {

      const postData: ChannelPostData = {
        ...Object.fromEntries(data) as Pick<ChannelPostData, 'name' | 'description'>,
        groupUuid
      };
      await updateChannel({ uuid: channelData.uuid, data: postData });
    }
    catch (e) {
      console.error(e);
    }
  }

  return (<>
    <FramerModal isOpen={isRemoveChannelModalOpen} onOutlineClick={handleRemoveChannelModalClose}>
      <ModalWindow
        isAutoSize
        onClose={handleRemoveChannelModalClose}
        title="Удаление канала"
      >
        <div className="overflow-y-auto flex h-full justify-center items-center">
          <div>
            <div className="text-center">
              Уверены в снесении канала? Сообщения канала будут также снесены. Это неотменяемая операция.
            </div>
            <div className="flex justify-around mt-4">
              <Button type="danger" onClick={handleRemoveChannel}>Снести</Button>
              <Button type="info" onClick={handleRemoveChannelModalClose}>Отмена</Button>
            </div>
          </div>
        </div>
      </ModalWindow>
    </FramerModal>
    <FramerModal isOpen={isOpen} onOutlineClick={onClose}>
      <ModalWindow
        isAutoSize
        onClose={onClose}
        title="Редактировать канал"
      >
        <div className="h-full md:h-[calc(100vh-10rem)] md:w-[30rem] overflow-y-auto">
          <CreateChannelForm
            onSubmit={handleSubmitEditChannel}
            initialData={channelData}
            submitButtonText="Изменить"
            onDelete={handleRemoveChannelModalOpen}
          />
        </div>
      </ModalWindow>
    </FramerModal>
  </>)
}

export default EditChannelModal;