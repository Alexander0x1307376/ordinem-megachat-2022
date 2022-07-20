import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputLoadImage from "../inputControls/InputLoadImage";
import InputText from "../inputControls/InputText";
import { GroupPostData } from "@ordinem-megachat-2022/shared";
import { BASE_API_URL } from "../../config";


export interface CreateGroupFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>, formData: FormData) => void;
  initialData?: Partial<GroupPostData & { avaPath: string }>;
  submitButtonText?: string;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ 
  onSubmit, initialData, submitButtonText = 'Создать группу' 
}) => {

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    formData.delete('ava');
    onSubmit(event, formData);
  }

  return (
    <form encType="multipart/form-data" onSubmit={handleSubmit}>
      <InputLoadImage 
        name="ava" 
        uuid={initialData?.avaUuid}
        initialImagePath={initialData?.avaPath ? BASE_API_URL + initialData?.avaPath : undefined} 
      />

      <InputText name="name" label="Название" value={initialData?.name} />
      <InputText name="description" label="Описание" value={initialData?.description} />

      <div className="flex flex-col mt-8">
        <Button type="accent" htmlType="submit">{submitButtonText}</Button>
      </div>

    </form>
  )
}

export default CreateGroupForm;