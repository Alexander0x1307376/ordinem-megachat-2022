import { useContext, useMemo } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";
import { ChatSystemEvents as chatEvents } from "@ordinem-megachat-2022/shared";
import { ChangeData } from "@ordinem-megachat-2022/shared";
import { useAppDispatch } from "../../store/utils/hooks";
import { realtimeSystemActions } from "./realtimeSystemSlice";


const useRealtimeSystemEmitter = () => {
  const wc = useContext(WebsocketContext);
  const dispatch = useAppDispatch();

  if (!wc?.socket) {
    console.warn('there is no socket. users data emitter is not initialized');
  }
  const socket = wc?.socket;

  const synchronization = () => {
    // socket?.emit(chatEvents.REQUEST_USER_STATUSES, userUuidList);
  };

  const subscribeToChanges = (data: Partial<ChangeData>) => {
    dispatch(realtimeSystemActions.setRealtimeState(data));
    socket?.emit(chatEvents.SUBSCRIBE_TO_CHANGES, data);
  }

  const unsubscibeToChanges = (data: Partial<ChangeData>) => {
    dispatch(realtimeSystemActions.removeRealtimeState(data));
    socket?.emit(chatEvents.UNSUBSCRIBE_TO_CHANGES, data);
  }


  const methods = useMemo(() => ({
    synchronization,
    subscribeToChanges,
    unsubscibeToChanges
  }), [socket]);

  return methods;
}

export default useRealtimeSystemEmitter;