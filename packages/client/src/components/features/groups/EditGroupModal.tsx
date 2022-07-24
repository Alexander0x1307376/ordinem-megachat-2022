import { GroupPostData } from "@ordinem-megachat-2022/shared";
import React, { FormEvent } from "react";
import { useEditGroupMutation } from "../../../features/groups/groupsService";
import CreateGroupForm from "../../forms/CreateGroupForm";
import ModalWindow from "../../layouts/ModalWindow";
import FramerModal from "../../shared/FramerModal";

export interface EditGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  groupData: Partial<GroupPostData & { uuid: string; }>;
  onSuccess?: (result: any) => void;
  onFail?: (error: any) => void;
}

const EditGroupModal: React.FC<EditGroupModalProps> = ({
  isOpen, onClose, groupData, onSuccess, onFail
}) => {

  const [updateGroup] = useEditGroupMutation();

  const handleChangeGroup = async (event: FormEvent<HTMLFormElement>, formData: FormData) => {
    event.preventDefault();
    if (!groupData.uuid) return;
    try {
      const postData = Object.fromEntries(formData.entries());
      const result = await updateGroup({ uuid: groupData.uuid, data: postData }).unwrap();
      onSuccess?.(result);
      (event.target as any).reset();
      
    } catch (e) {
      onFail?.(e);
      console.error(e);
    }
  }

  return (
    <FramerModal isOpen={isOpen} onOutlineClick={onClose}>
      <ModalWindow
        isAutoSize
        onClose={onClose}
        title="Редактировать группу"
      >
        <div className="h-full md:h-[calc(100vh-10rem)] md:w-[30rem] overflow-y-auto">
          <CreateGroupForm
            onSubmit={handleChangeGroup}
            initialData={groupData}
            submitButtonText="Изменить данные группы"
          />
        </div>
      </ModalWindow>
    </FramerModal>
  );
}

export default EditGroupModal;