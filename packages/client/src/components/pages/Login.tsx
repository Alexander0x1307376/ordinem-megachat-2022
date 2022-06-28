import React, { FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginMutation } from "../../features/auth/authService";
import LoginForm from "../forms/LoginForm";
import BlockInCentre from "../layouts/BlockInCentre";
import Button from "../shared/Button";
import InputText from "../inputControls/InputText";
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

        <LoginForm onSubmit={handleSubmit} /> 

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
