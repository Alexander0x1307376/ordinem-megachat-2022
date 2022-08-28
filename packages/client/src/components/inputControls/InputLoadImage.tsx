import React, { ChangeEvent, MouseEvent, useEffect, useRef, useState } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { BASE_API_URL } from "../../config";
import { useUploadImageMutation } from "../../features/images/imageService";

export interface InputLoadImageProps {
  name: string;
  onChange?: (value: any) => void;
  initialImagePath?: string;
  uuid?: string;
}
// const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];

const InputLoadImage: React.FC<InputLoadImageProps> = ({ 
  name, onChange, initialImagePath, uuid
}) => {

  const [fileName, setFileName] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const [currentAvaPath, setCurrentAvaPath] = useState<string>('');
  useEffect(() => {
    setCurrentAvaPath(initialImagePath || '');
  }, [initialImagePath, setCurrentAvaPath]);

  const [uploadImage] = useUploadImageMutation();

  const avaUuidInputRef = useRef<any>();

  const handleImageChange = async (event: ChangeEvent<HTMLElement> | any) => {
    if(!avaUuidInputRef.current) return;

    const fileData = event.target.files[0];
    if(!fileData) {
      console.log('handleImageChange: файла нет');
      return;
    }
    try {
      console.log('fileData', fileData);
      const formData = new FormData();
      formData.set('ava', fileData);
      const result = await uploadImage(formData).unwrap();
      setCurrentAvaPath(BASE_API_URL + result.path);
      setFileName(result.name);
      avaUuidInputRef.current.value = result.uuid;

      console.log('handleImageChange: result', result);
    } catch (e) {
      console.error(e);
      setIsError(true);
    }
  }

  const handleClearImage = (event: MouseEvent) => {
    event.preventDefault();
    if (!avaUuidInputRef.current) return;

    avaUuidInputRef.current.value = '';
    setCurrentAvaPath('');
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
          (currentAvaPath) 
          ? (<>
              <div className="shrink-0 relative h-32 w-32">
                <img
                  className="rounded-full h-full w-full object-cover"
                  src={currentAvaPath} 
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

        {/* Данные файла */}
        <div className="p-4 flex flex-col justify-center truncate">
          <h2>Аватарка</h2>
          { fileName && <h2 className="font-bold truncate">{fileName}</h2> }
          { isError && <h2 className="text-danger">Неверный тип файла</h2> }
        </div>

        <input
          id={name}
          name={name}
          type="file"
          className="hidden"
          onChange={handleImageChange}
        />
      </label>
      <input 
        type="text" 
        className="hidden" 
        name={name + 'Uuid'} 
        defaultValue={uuid}
        ref={avaUuidInputRef} 
      />
    </div>
  )
}

export default InputLoadImage;