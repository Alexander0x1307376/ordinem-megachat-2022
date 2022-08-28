import { ChannelPostData } from "@ordinem-megachat-2022/shared";
import React, { FormEvent } from "react";
import { useCreateChannelMutation } from "../../../features/channels/channelsService";
import CreateChannelForm from "../../forms/CreateChannelForm";
import ModalWindow from "../../layouts/ModalWindow";
import FramerModal from "../../shared/FramerModal";

export interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupUuid?: string;
}

const CreateChannelModal: React.FC<CreateChannelModalProps> = ({
  isOpen, onClose, groupUuid
}) => {

  const [createChannel] = useCreateChannelMutation();
  const handleSubmitCreateChannel = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!groupUuid) return;

    const data = new FormData(event.target as HTMLFormElement);
    try {
      const postData: ChannelPostData = {
        ...Object.fromEntries(data) as Pick<ChannelPostData, 'name' | 'description'>,
        groupUuid
      };
      await createChannel(postData);
      (event.target as any).reset();
      onClose();
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <FramerModal isOpen={isOpen} onOutlineClick={onClose}>
      <ModalWindow
        isAutoSize
        onClose={onClose}
        title="Добавить канал"
      >
        <div className="h-full md:h-[calc(100vh-10rem)] md:w-[30rem] overflow-y-auto">
          <CreateChannelForm onSubmit={handleSubmitCreateChannel} />
        </div>
      </ModalWindow>
    </FramerModal>
  )
}

export default CreateChannelModal;