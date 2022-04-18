import React, { FormEvent } from "react";
import BlockInCentre from "../layouts/BlockInCentre";
import Button from "../shared/Button";
import InputText from "../shared/InputText";

const Login: React.FC = () => {

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);
    console.log(Object.fromEntries(data.entries()));
  }

  return (
    <BlockInCentre>
      <h1 className="font-bold text-lg">Логин</h1>

      <form onSubmit={handleSubmit}>

        <InputText name="login" label="Логин" />
        <InputText name="password" label="Пароль" htmlType="password" />

        <div className="flex flex-col mt-8">
          <Button type="accent" htmlType="submit">Регистрация</Button>
        </div>

      </form>
    </BlockInCentre>
  )
}

export default Login;
