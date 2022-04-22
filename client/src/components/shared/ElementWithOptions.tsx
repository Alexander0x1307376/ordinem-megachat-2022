import React, { useState } from "react";
import Ava from "../shared/Ava";
import { IoEllipsisVertical } from "react-icons/io5";
import IconedButton from "../shared/IconedButton";
import { Popover } from 'react-tiny-popover';
import PopoverMenuOptions, {PopoverMenuOptionsProps} from "./PopoverMenuOptions";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import PopoverButton from "./PopoverButton";


export interface ElementWithOptionsProps {
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  options: PopoverMenuOptionsProps['options'];
}


const ElementWithOptions: React.FC<ElementWithOptionsProps> = ({ 
  title, description, imageUrl, options, link
}) => {

  return (
    <div className="
      rounded-lg bg-bglighten
      flex
    ">
      <Link className="grow flex p-4" to={link}>
        <div className="mr-4">
          <Ava imageUrl={imageUrl} />
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