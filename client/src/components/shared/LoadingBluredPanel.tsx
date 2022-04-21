import { motion, AnimatePresence } from "framer-motion";
import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


// блок, в котором размещаем данный компонент, должен быть relative

export interface LoadingBluredPanelProps {
  isPanelDisplayed: boolean;
}

const LoadingBluredPanel: React.FC<LoadingBluredPanelProps> = ({ isPanelDisplayed }) => {
  return (<>
    { isPanelDisplayed && (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: .2 }}
          className="absolute -top-4 -left-4 -right-4 -bottom-4 z-50 
              bg-glassy rounded-lg
              backdrop-blur-sm
              flex flex-col justify-center items-center
              "
        >
          <AiOutlineLoading3Quarters className="animate-spin" size={'5rem'} />
          <span className="mt-4">Загрузка...</span>
        </motion.div>
      </AnimatePresence>
    )}
  </>)
}

export default LoadingBluredPanel;