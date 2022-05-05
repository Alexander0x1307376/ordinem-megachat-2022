import { debounce, throttle } from "lodash";
import { useMemo, useRef } from "react";


const useThrottledDebouncedCallback = (callback: (...params: any) => void, delayed: number) => {

  const callbackRef = useRef(callback);

  const throttled = useMemo(() => throttle(callbackRef.current, delayed), [delayed, callbackRef]);
  const debounced = useMemo(() => debounce(callbackRef.current, delayed), [delayed, callbackRef]);

  return (...params: any) => {
    throttled(...params);
    debounced(...params);
  }
}

export default useThrottledDebouncedCallback;