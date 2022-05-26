import React, { FormEvent } from "react";
import BlockInCentre from "../layouts/BlockInCentre";
import Button from "../shared/Button";
import InputLoadImage from "../inputControls/InputLoadImage";
import InputText from "../inputControls/InputText";

const CreateGroup: React.FC = () => {


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {

  }

  return (
    <BlockInCentre>
      <div className="relative">
        <h1 className="font-bold text-lg mb-4">Создание группы</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">

          <InputLoadImage name="ava" />
          <InputText name="name" label="Название" />

          <div className="flex flex-col mt-8">
            <Button type="accent" htmlType="submit">Создать</Button>
          </div>
        </form>
      </div>
    </BlockInCentre>
  )
}

export default CreateGroup;