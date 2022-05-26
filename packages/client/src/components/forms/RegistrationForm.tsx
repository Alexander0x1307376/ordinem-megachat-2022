import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputLoadImage from "../inputControls/InputLoadImage";
import InputText from "../inputControls/InputText";


export interface RegistrationFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({onSubmit}) => {

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">

      <InputLoadImage name="ava" />

      <InputText name="name" label="Логин" />
      <InputText name="email" label="Email" />
      <InputText name="password" label="Пароль" htmlType="password" />
      <InputText name="password_confirm" label="Подтверждение пароля" htmlType="password" />

      <div className="flex flex-col mt-8">
        <Button type="accent" htmlType="submit">Регистрация</Button>
      </div>

    </form>
  )
}

export default RegistrationForm;