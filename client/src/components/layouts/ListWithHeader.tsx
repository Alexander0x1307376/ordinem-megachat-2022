import React from "react";
import Header, { HeaderProps } from "../shared/Header";

export interface ListWithHeaderProps {
  headerProps: HeaderProps;
  children: React.ReactNode;
}

const ListWithHeader: React.FC<ListWithHeaderProps> = ({headerProps, children}) => {
  return (
    <div className="flex flex-col h-full">
      <Header {...headerProps} />
      <div className="grow w-full h-full bg overflow-y-auto">
        <div className="flex flex-col space-y-4 p-4">
          {children}
        </div>
      </div>
    </div>
  )
}

export default ListWithHeader;