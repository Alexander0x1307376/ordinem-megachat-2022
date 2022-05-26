import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputText from "../inputControls/InputText";
import InputTextArea from "../inputControls/InputTextArea";

export interface CreateChannelFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CreateChannelForm: React.FC<CreateChannelFormProps> = ({ onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col h-full">

      <InputText name="name" label="Название" />
      <div className="grow">
        <InputTextArea name="description" label="Описание" />
      </div>

      <div className="flex flex-col mt-8">
        <Button type="accent" htmlType="submit">Войти</Button>
      </div>

    </form>
  );
}

export default CreateChannelForm;