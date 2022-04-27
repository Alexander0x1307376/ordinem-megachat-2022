import React, { createContext } from "react";
import { AnimatePresence, motion } from 'framer-motion';

export interface FramerModalProps {
  isOpen?: boolean;
  onOutlineClick?: () => void;
  children: React.ReactNode;
}

const FramerModal: React.FC<FramerModalProps> = ({ children, isOpen, onOutlineClick }) => {


  const handleClick = (event: React.MouseEvent) => {
    onOutlineClick?.();
  }

  const animation = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: {duration: .15}
  }

  return (
    <AnimatePresence exitBeforeEnter>
    {isOpen && (<>
      <motion.div 
        {...animation}
        className="fixed z-40 top-0 left-0 w-screen h-screen bg-glassydarken flex justify-center items-center"
        onClick={handleClick}
      >
        <div 
          className="h-full w-full md:h-auto md:w-auto" 
          onClick={e => e.stopPropagation()}
        >
          {children}
        </div>
      </motion.div>
      </>)}
    </AnimatePresence>
  )
}


export default FramerModal;