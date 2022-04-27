import { motion, AnimatePresence } from "framer-motion";
import React, { useState } from "react";
import { IconType } from "react-icons";
import { Popover } from "react-tiny-popover";
import Button from "./Button";
import IconedButton from "./IconedButton";
import PopoverMenuOptions, { PopoverMenuOptionsProps } from "./PopoverMenuOptions";


export interface PopoverButtonProps {
  icon?: IconType;
  text?: string;
  menuOptions: PopoverMenuOptionsProps['options']
}

const PopoverButton: React.FC<PopoverButtonProps> = ({ icon: Icon, text, menuOptions }) => {

  const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(false);


  let buttonContent;


  const handleClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
  }

  if (Icon) 
    buttonContent = <IconedButton title={text} onClick={handleClick} icon={Icon} />
  
  else if (!Icon && text) 
    buttonContent = <Button onClick={handleClick} />

  else 
    throw new Error('It needs either text or icon!')
  

  return (
    <div>
      <AnimatePresence>
        <Popover
          isOpen={isPopoverOpen}
          positions={['left', 'top', 'bottom', 'right']}
          content={

            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: .2 }}
            >
              <PopoverMenuOptions onOptionClick={handleClick} options={menuOptions} />
            </motion.div>

          }
          align='start'
          onClickOutside={() => setIsPopoverOpen(false)}
        >
          <div>
            {buttonContent}
          </div>
        </Popover>
      </AnimatePresence>
    </div>
  )
}

export default PopoverButton;