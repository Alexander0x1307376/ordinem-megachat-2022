import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../store/services/authService";
import BlockInCentre from "../layouts/BlockInCentre";
import Button from "../shared/Button";
import InputText from "../shared/InputText";
import LoadingBluredPanel from "../shared/LoadingBluredPanel";

const Login: React.FC = () => {

  const navigate = useNavigate();
  const [login, { isLoading, isError }] = useLoginMutation();


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const data = new FormData(event.target as HTMLFormElement);
    const result = await login(Object.fromEntries(data.entries()) as any);
    if (!('error' in result))
      navigate('/');
  }

  return (
    <BlockInCentre>
      <div className="relative">
        <LoadingBluredPanel isPanelDisplayed={isLoading} />
        <h1 className="font-bold text-lg">Логин</h1>
        <form onSubmit={handleSubmit}>

          <InputText name="login" label="Логин" />
          <InputText name="password" label="Пароль" htmlType="password" />

          <div className="flex flex-col mt-8">
            <Button type="accent" htmlType="submit">Войти</Button>
          </div>

        </form>

        {
          isError && (
            <div className="absolute top-0 right-0 text-dangerBrighten">
              Неверный логин или пароль
            </div>
          )
        }
      </div>
    </BlockInCentre>
  )
}

export default Login;
