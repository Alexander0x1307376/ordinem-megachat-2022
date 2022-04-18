import React from "react";
import Ava from "../shared/Ava";

const AccountWidget: React.FC = () => {
  return (
    <div className="rounded-lg bg-glassy w-full p-4 flex items-center">
      <Ava imageUrl="https://i.pravatar.cc/150?img=60" />
      <a href="#" className="mx-4 grow">Пользователь</a>
      <span className="mx-4">в сети</span>
    </div>
  )
}

export default AccountWidget;