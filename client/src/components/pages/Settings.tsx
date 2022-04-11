import React, { useRef, useState } from "react";

const Settings: React.FC = () => {

  const [check, setCheck] = useState<any>();
  const checkInput = useRef();


  return (
    <div className="flex">
      <div>
        <div className="flex items-center">
            <label className="form-check-label inline-block text-gray-800" htmlFor="flexCheckDefault">
              Default checkbox
            </label>
            <input type="checkbox" id="flexCheckDefault" />
        </div>
      </div>
    </div>
  )
}

export default Settings;