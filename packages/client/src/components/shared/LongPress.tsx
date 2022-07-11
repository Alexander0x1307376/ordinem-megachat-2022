import React, { Fragment, MouseEvent, TouchEvent } from "react";
import useLongPress from "../../hooks/useLongPress";
// import { useLongPress } from 'use-long-press';


export interface LongPressProps {
  onLongPress: () => void;
  className?: React.HTMLAttributes<HTMLDivElement>['className'];
}

const LongPress: React.FC<LongPressProps> = ({children, onLongPress, className}) => {

  const bind = useLongPress((event) => {
    event.stopPropagation();
    event.preventDefault();
    console.log('LONGPRESSHOOK!', event);
    // onLongPress();
  });

  return (
    <div {...bind} className={className}>
      {children}
    </div>
  );
}

export default LongPress;