import React, {FormEvent} from "react";
import Button from "../shared/Button";
import InputText from "../shared/InputText";
import BlockInCentre from "../layouts/BlockInCentre";
import InputLoadImage from "../shared/InputLoadImage";

const Register: React.FC = () => {

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    const submitData = Object.fromEntries(data.entries());
    console.log(submitData);
  }

  return (
    <BlockInCentre>
        <h1 className="font-bold text-lg mb-4">Регистрация</h1>

        <form onSubmit={handleSubmit}>

          <InputLoadImage name="ava" />

          <InputText name="login" label="Логин" />
          <InputText name="email" label="Email" />
          <InputText name="password" label="Пароль" htmlType="password" />
          <InputText name="password_confirm" label="Подтверждение пароля" htmlType="password" />

          <div className="flex flex-col mt-8">
            <Button type="accent" htmlType="submit">Регистрация</Button>
          </div>

        </form>
    </BlockInCentre>
  )
}

export default Register;
