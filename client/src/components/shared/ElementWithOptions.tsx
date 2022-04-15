import React, { useState } from "react";
import Ava from "../shared/Ava";
import { IoEllipsisVertical } from "react-icons/io5";
import IconedButton from "../shared/IconedButton";
import { Popover } from 'react-tiny-popover';
import PopoverMenuOptions, {PopoverMenuOptionsProps} from "./PopoverMenuOptions";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";


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

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);


  return (
    <div className="
      rounded-lg mb-2 bg-bglighten
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
        <AnimatePresence>
        <Popover
          isOpen={isPopoverOpen}
          positions={['left', 'top', 'bottom', 'right']}
          content={
            
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{duration: .2}}
              >
                <PopoverMenuOptions options={options} />
              </motion.div>
            
          }
          align='start'
          onClickOutside={() => setIsPopoverOpen(false)}
        >
          <div>
            <IconedButton
              onClick={() => setIsPopoverOpen(!isPopoverOpen)}
              icon={IoEllipsisVertical}
            />
          </div>
        </Popover>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default ElementWithOptions;