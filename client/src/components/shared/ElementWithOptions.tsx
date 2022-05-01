import React, { useState } from "react";
import Ava from "../shared/Ava";
import { IoEllipsisVertical } from "react-icons/io5";
import {PopoverMenuOptionsProps} from "./PopoverMenuOptions";
import { Link } from "react-router-dom";
import PopoverButton from "./PopoverButton";
import { IconType } from "react-icons";


export interface ElementWithOptionsProps {
  title: string;
  description: string;
  imageUrl?: string;
  imagePlaceholder: IconType;
  link: string;
  options: PopoverMenuOptionsProps['options'];
}


const ElementWithOptions: React.FC<ElementWithOptionsProps> = ({ 
  title, description, imageUrl, options, link, imagePlaceholder: Iph
}) => {

  return (
    <div className="
      rounded-lg bg-bglighten
      flex
    ">
      <Link className="grow flex p-4" to={link}>
        <div className="mr-4">
          {
            imageUrl
            ? <Ava imageUrl={imageUrl} />
            : <Iph className="h-10 w-10" />
          }
        </div>
        <div className="grow">
          <h2 className="text-lg font-semibold">{title}</h2>
          <h3 className="">{description}</h3>
        </div>
      </Link>
      <div className="p-4">
        <PopoverButton 
          menuOptions={options}
          icon={IoEllipsisVertical}
        />
      </div>
    </div>
  )
}

export default ElementWithOptions;