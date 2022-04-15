import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';



export interface DoubleSidebaredProps {
  leftSidebarContent: React.ReactNode;
  rightSidebarContent: React.ReactNode;
  children: React.ReactNode;
  layoutState: 'leftIsOpen' | 'init' | 'rightIsOpen' | 'bothAreOpen';
  onOutlineClick: () => void;
}

const DoubleSidebared: React.FC<DoubleSidebaredProps> = ({
  leftSidebarContent, rightSidebarContent, children, layoutState = 'init', onOutlineClick
}) => {

  const isMdScreen = useMediaQuery({ query: '(min-width: 768px)' })

  const leftSidebarAnim = {
    init: { x: '-100%' },
    active: { x: 0 },
  };
  const rightSidebarAnim = {
    init: { x: '100%' },
    active: { x: 0 }
  };

  const mainAnim = isMdScreen 
  ? {
    init: { paddingLeft: '1rem', paddingRight: '1rem' },
    leftIsOpen: { paddingLeft: '18rem', paddingRight: '1rem' },
    rightIsOpen: { paddingLeft: '1rem', paddingRight: '18rem' },
    bothAreOpen: { paddingLeft: '18rem', paddingRight: '18rem' }
  }
  : {
    init: { paddingLeft: '1rem', paddingRight: '1rem' },
    leftIsOpen: { paddingLeft: '1rem', paddingRight: '1rem' },
    rightIsOpen: { paddingLeft: '1rem', paddingRight: '1rem' },
    bothAreOpen: { paddingLeft: '1rem', paddingRight: '1rem' },
  };

  const transition = {
    duration: .2,
    type: 'just'
  }

  return (
    <div className='w-full h-full relative overflow-hidden'>
      
      {/* главный блок */}
      <motion.div 
        animate={layoutState}
        transition={transition}
        variants={mainAnim}
        className='
          p-4 h-full w-full
        '
      >
        <AnimatePresence>
          {(layoutState !== 'init' && !isMdScreen) && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={transition}
              onClick={onOutlineClick}
              className='absolute bg-glassy rounded-lg top-4 left-4 bottom-4 right-4'
            ></motion.div>
          )}
        </AnimatePresence>
        {children}
      </motion.div>

      {/* левый сайдбар */}
      <AnimatePresence>
      {(layoutState === 'leftIsOpen' || layoutState === 'bothAreOpen') && (
        <motion.aside 
          key='leftSidebar'
          initial='init'
          animate='active'
          exit='init'
          variants={leftSidebarAnim}
          transition={transition}
          className='
            absolute z-40 p-4 h-full w-72 top-0 left-0
          '
        >
          {leftSidebarContent}
        </motion.aside>
      )}
      </AnimatePresence>
      
      {/* правый сайдбар */}
      <AnimatePresence>
      {(layoutState === 'rightIsOpen' || layoutState === 'bothAreOpen') && (
        <motion.aside 
          key='rightSidebar'
          initial='init'
          animate='active'
          exit='init'
          transition={transition}
          variants={rightSidebarAnim}
          className='
            absolute top-0 right-0 h-full w-72 z-40 p-4
          '
        >
          {rightSidebarContent}
        </motion.aside>
      )}
      </AnimatePresence>

    </div>
  )
}

export default DoubleSidebared;