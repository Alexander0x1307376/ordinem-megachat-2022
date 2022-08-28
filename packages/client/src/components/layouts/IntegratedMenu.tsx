import { AnimatePresence, motion } from "framer-motion";
import React, { useRef } from "react";
import { IoClose } from "react-icons/io5";
import useOutsideClickHandler from "../../utils/useOutsideClickHandler";
import IconedButton from "../shared/IconedButton";

export interface IntegratedMenuProps {
  children: React.ReactNode;
  isMenuOpen: boolean;
  onCloseClick: () => void;
  onOutsideClick: () => void;
}

const IntegratedMenu: React.FC<IntegratedMenuProps> = ({ 
  children, isMenuOpen, onOutsideClick, onCloseClick
}) => {
  const handleOutsideClick = () => {
    onOutsideClick();
  }
  const menuRef = useRef();
  useOutsideClickHandler(menuRef, handleOutsideClick);

  return (
    <AnimatePresence exitBeforeEnter>
      {isMenuOpen && (
        <motion.div
          ref={menuRef as any}
          className="
            absolute bg-bglighten2 drop-shadow-lg top-0 right-0 
            w-full py-2 pl-2 rounded-lg overflow-hidden z-10"
          initial={{ height: 0, width: 0 }}
          animate={{ height: 'auto', width: '100%' }}
          exit={{ height: 0, width: 0 }}
          transition={{ duration: .1 }}
        >
          <div className="absolute top-4 right-3">
            <IconedButton
              icon={IoClose}
              onClick={onCloseClick}
              size='1.5rem'
            />
          </div>          
          <div className="flex flex-col pr-12 space-y-1">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default IntegratedMenu;