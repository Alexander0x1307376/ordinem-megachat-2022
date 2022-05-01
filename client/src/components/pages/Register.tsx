import React, { FormEvent } from "react";
import BlockInCentre from "../layouts/BlockInCentre";
import { useRegistrationMutation } from "../../store/services/authService";
import { useNavigate } from "react-router-dom";
import LoadingBluredPanel from "../shared/LoadingBluredPanel";
import RegistrationForm from "../forms/RegistrationForm";

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


  return (
    <BlockInCentre>
      <div className="relative">
        <LoadingBluredPanel isPanelDisplayed={isLoading} />
        <h1 className="font-bold text-lg mb-4">Регистрация</h1>
        <RegistrationForm onSubmit={handleSubmit} />
      </div>
    </BlockInCentre>
  )
}

export default Register;
