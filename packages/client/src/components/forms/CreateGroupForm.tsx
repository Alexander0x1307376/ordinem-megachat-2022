import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputLoadImage from "../inputControls/InputLoadImage";
import InputText from "../inputControls/InputText";
import { GroupPostData } from "@ordinem-megachat-2022/shared";


export interface CreateGroupFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  initialData?: Partial<GroupPostData>;
  submitButtonText?: string;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ 
  onSubmit, initialData, submitButtonText = 'Создать группу' 
}) => {
  return (
    <form encType="multipart/form-data" onSubmit={onSubmit}>
      <InputLoadImage name="ava" imagePath={initialData?.avaPath} />

      <InputText name="name" label="Название" value={initialData?.name} />
      <InputText name="description" label="Описание" value={initialData?.description} />

      <div className="flex flex-col mt-8">
        <Button type="accent" htmlType="submit">{submitButtonText}</Button>
      </div>

    </form>
  )
}

export default CreateGroupForm;