import React, { useRef, useEffect, MouseEvent, MutableRefObject } from "react";




/**
 * Hook that alerts clicks outside of the passed ref
 */
const useOutsideClickHandler = (ref: MutableRefObject<any>, callback: (e: MouseEvent) => void) => {

  useEffect(() => {
    
    const handleClickOutside = (event: any) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback(event);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref]);
}

export default useOutsideClickHandler;

/**
 * Component that alerts if you click outside of it
 */
// export default function OutsideAlerter(props) {
//   const wrapperRef = useRef(null);
//   useOutsideAlerter(wrapperRef);

//   return <div ref={ wrapperRef }> { props.children } < /div>;
// }