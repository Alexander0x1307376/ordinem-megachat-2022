import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputLoadImage from "../shared/InputLoadImage";
import InputText from "../shared/InputText";


export interface CreateGroupFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const CreateGroupForm: React.FC<CreateGroupFormProps> = ({ onSubmit }) => {
  return (
    <form encType="multipart/form-data" onSubmit={onSubmit}>
      <InputLoadImage name="ava" />

      <InputText name="name" label="Название" />
      <InputText name="description" label="Описание" />

      <div className="flex flex-col mt-8">
        <Button type="accent" htmlType="submit">Войти</Button>
      </div>

    </form>
  )
}

export default CreateGroupForm;