import React, { FormEvent } from "react";
import Button from "../shared/Button";
import InputText from "../shared/InputText";
import BlockInCentre from "../layouts/BlockInCentre";
import InputLoadImage from "../shared/InputLoadImage";
import { useRegistrationMutation } from "../../store/services/authService";
import { useNavigate } from "react-router-dom";
import LoadingBluredPanel from "../shared/LoadingBluredPanel";

const Register: React.FC = () => {

  const [registration, {isLoading, isError}] = useRegistrationMutation();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.target as HTMLFormElement);

    try {
      await registration(data).unwrap();
      navigate('/');
    } catch(e) {

    }
  }

  const handleFileChange = (value: any) => {
    // setAvaFile(value);
  }

  return (
    <BlockInCentre>
      <div className="relative">
        
        <LoadingBluredPanel isPanelDisplayed={isLoading} />

        <h1 className="font-bold text-lg mb-4">Регистрация</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <InputLoadImage name="ava" onChange={handleFileChange} />

          <InputText name="name" label="Логин" />
          <InputText name="email" label="Email" />
          <InputText name="password" label="Пароль" htmlType="password" />
          <InputText name="password_confirm" label="Подтверждение пароля" htmlType="password" />

          <div className="flex flex-col mt-8">
            <Button type="accent" htmlType="submit">Регистрация</Button>
          </div>

        </form>
      </div>
    </BlockInCentre>
  )
}

export default Register;
