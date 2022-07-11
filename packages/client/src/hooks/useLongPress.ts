import { useState, useEffect, TouchEvent, MouseEvent } from 'react';

const useLongPress = (onLongPress = (event: TouchEvent | MouseEvent) => {}, ms = 300) => {
  const [startLongPress, setStartLongPress] = useState(false);
  const [event, setEvent] = useState<any>();
  const [mark, setMark] = useState<string>('');

  useEffect(() => {
    let timerId: any;
    if (startLongPress) {
      timerId = setTimeout(() => {
        console.log('mark', mark);
        onLongPress(event);
      }, ms);
    } else {
      clearTimeout(timerId);
    }

    return () => {
      clearTimeout(timerId);
    };
  }, [onLongPress, ms, startLongPress, event]);

  return {
    // onMouseDown: (event: MouseEvent) => {
    //   setStartLongPress(true);
    // },
    // onMouseUp: (event: MouseEvent) => {
    //   setStartLongPress(false);
    // },
    // onMouseLeave: (event: MouseEvent) => {
    //   setStartLongPress(false);
    // },
    // onTouchStart: (event: TouchEvent) => {
    //   setStartLongPress(true);
    // },
    // onTouchEnd: (event: TouchEvent) => {
    //   setStartLongPress(false);
    // },
    onMouseDownCapture: (event: MouseEvent) => {
      setMark('onMouseDownCapture');
      setEvent(event);
      setStartLongPress(true);
    },
    onMouseUpCapture: (event: MouseEvent) => {
      setMark('onMouseUpCapture');
      setEvent(event);
      setStartLongPress(false);
    },
    onTouchStartCapture: (event: TouchEvent) => {
      setMark('onTouchStartCapture');
      setEvent(event);
      setStartLongPress(true);
    },
    onTouchEndCapture: (event: TouchEvent) => {
      setMark('onTouchEndCapture');
      setEvent(event);
      setStartLongPress(false);
    },
  };
}

export default useLongPress;