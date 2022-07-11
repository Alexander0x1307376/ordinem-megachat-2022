import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputText from "../inputControls/InputText";
import InputTextArea from "../inputControls/InputTextArea";
import { ChannelPostData } from "@ordinem-megachat-2022/shared";

export interface CreateChannelFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  initialData?: Partial<ChannelPostData>;
  submitButtonText?: string;
  onDelete?: () => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ 
  onSubmit, initialData, submitButtonText = 'Создать', onDelete 
}) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">

      <InputText name="name" label="Название" value={initialData?.name || ''} />
      <div className="grow">
        <InputTextArea name="description" label="Описание" value={initialData?.description || ''} />
      </div>

      <div className="flex flex-row-reverse mt-8">
        <div className="flex flex-col">
          <Button type="accent" htmlType="submit">{submitButtonText}</Button>
        </div>
        {onDelete && (
          <div className="flex flex-col mr-4">
            <Button type="danger" onClick={onDelete}>Снести</Button>
          </div>
        )}
      </div>

    </form>
  );
}

export default CreateChannelForm;