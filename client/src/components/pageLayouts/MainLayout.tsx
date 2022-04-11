import React from "react";


export interface MainLayoutProps {
  pageTitle: string;
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ pageTitle, children }) => {
  return (
    <div className='h-screen w-screen flex flex-col grow bg-fillmain text-textPrimary'>
      <div className="grow-0 bg-fillmain px-4 pt-2">
        <h1 className='text-2xl font-medium'>{pageTitle}</h1>
      </div>
      <div className='grow relative'>
        <div className="absolute top-4 bottom-4 left-4 right-4 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  )
}

export default MainLayout;