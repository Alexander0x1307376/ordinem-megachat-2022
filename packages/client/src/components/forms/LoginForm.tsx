import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputText from "../inputControls/InputText";

export interface LoginFormProps {
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({onSubmit}) => {
  return (
    <form onSubmit={onSubmit}>

      <InputText name="login" label="Логин" />
      <InputText name="password" label="Пароль" htmlType="password" />

      <div className="flex flex-col mt-8">
        <Button type="accent" htmlType="submit">Войти</Button>
      </div>

    </form>
  )
}

export default LoginForm;