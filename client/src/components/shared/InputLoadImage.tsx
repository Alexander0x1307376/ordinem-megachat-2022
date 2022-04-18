import React, { ChangeEvent, useRef, useState } from "react";
import { IoAdd, IoClose } from "react-icons/io5";


export interface InputLoadImageProps {
  name: string;
}
const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const InputLoadImage: React.FC<InputLoadImageProps> = ({name}) => {

  const [avaPreview, setAvaPreview] = useState<any>();
  const [fileName, setFileName] = useState<string>('');

  const [isError, setIsError] = useState<boolean>(false);
  
  const inputRef = useRef<any>();


  const handleImageChange = (event: ChangeEvent<HTMLElement> | any) => {

    const selected = event.target.files[0];
    if (selected && allowedTypes.includes(selected.type)) {
      setIsError(false);

      let reader = new FileReader();
      reader.onloadend = () => {
        console.log(selected);
        setAvaPreview(reader.result);
        setFileName(selected.name)
      }

      reader.readAsDataURL(selected);

    } 
    else {
      setFileName('');
      setIsError(true);
      inputRef.current.value = null;
    }
  }

  const handleClearImage = (event: any) => {
    event.preventDefault();
    setFileName('');
    setAvaPreview(null);
    setIsError(false);
    inputRef.current.value = '';
  }

  return (
    <div className="flex flex-col">
      <label className="
          rounded-r-lg
          rounded-l-[80px]
          bg-glassy
          hover:bg-bglighten
          relative
          cursor-pointer
          flex
          group
        " 
        htmlFor={name}
      >
        {
          avaPreview 
          ? (<>
              <div className="shrink-0 relative h-32 w-32">
                <img
                  className="rounded-full h-full w-full object-cover"
                  src={avaPreview} 
                  alt="ava"
                />
                <div className="
                h-full w-full absolute top-0 left-0 flex items-center justify-center 
                group-hover:bg-glassy rounded-full
              ">
                </div>
              </div>
              <button 
                className="absolute right-2 top-2 z-40 text-textSecondary hover:text-textPrimary"
                onClick={handleClearImage}
              >
                <IoClose size={'2rem'} />
              </button>
          </>)
          : (
              <div className="
                bg-bglighten flex flex-col justify-center items-center rounded-full
                group-hover:bg-bglighten2
                h-32 w-32
              ">
                <IoAdd size={'3rem'} />
              </div>
          )
        }

        <div className="p-4 flex flex-col justify-center truncate">
          <h2>Аватарка</h2>
          { fileName && <h2 className="font-bold truncate">{fileName}</h2> }
          { isError && <h2 className="text-danger">Неверный тип файла</h2> }
        </div>
        <input
          ref={inputRef}
          id={name}
          name={name}
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
    </div>
  )
}

export default InputLoadImage;