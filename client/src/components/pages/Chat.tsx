import React from "react";
import Ava from "../shared/Ava";




const Chat: React.FC = () => {

  return (
    <div className="h-screen flex flex-col bg-fillmain text-textPrimary p-4">
      <div className="grow relative">
        <div className="overflow-auto absolute top-0 bottom-0 w-full">
          <div className="w-full flex mb-4">
            <div className="grow-0">
              <Ava imageUrl="https://i.pravatar.cc/150?img=5"/>
            </div>
            <div className="grow bg-bglighten ml-4 p-4 rounded-lg">
              asdadsasda
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
              <p>asdasd</p>
            </div>
          </div>
        </div>
      </div>
      <div className="grow-0">
        <input 
          className="w-full p-4 rounded-lg bg-glassy font-medium text-lg outline-none" 
          type="text" 
        />
      </div>
    </div>
  )
}

export default Chat;