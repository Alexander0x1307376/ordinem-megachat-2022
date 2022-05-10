import React from "react";
import { motion } from "framer-motion";

const MotionHoc = (Component: React.FC) => {
  return function HOC() {
    return (
      <motion.div
        initial={{ y: 500 }}
        animate={{
          y: 0,
          transition: { duration: 0.5, type: "spring" },
        }}
        exit={{
          y: -500,
          transition: { duration: 0.5, type: "spring" },
        }}
      >
        <Component />
      </motion.div>
    );
  };
};

export default MotionHoc;