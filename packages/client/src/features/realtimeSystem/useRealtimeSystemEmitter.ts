import { useContext, useMemo } from "react";
import { WebsocketContext } from "../websocketsSystem/websocketContext";
import { ChatSystemEvents as chatEvents } from "@ordinem-megachat-2022/shared";
import { SubscribeToChangeData } from "@ordinem-megachat-2022/shared";
import { useAppDispatch } from "../../store/utils/hooks";
import { realtimeSystemActions } from "./realtimeSystemSlice";

/**
 * useRealtimeSystemEmitter служит для подписки на измения данных,
 * изменения которых нужно отслеживать в реальном времени
 * (сообщения чатов, данные пользователлей - их личные данные и онлайн статус и т.п.)
 */
const useRealtimeSystemEmitter = () => {

  const wc = useContext(WebsocketContext);
  const dispatch = useAppDispatch();

  if (!wc?.socket) {
    console.warn('there is no socket. realtime system emitter is not initialized');
  }
  const socket = wc?.socket;

  const result = useMemo(() => {

    const subscribeToChanges = (data: Partial<SubscribeToChangeData>) => {
      dispatch(realtimeSystemActions.setRealtimeState(data));
      socket?.emit(chatEvents.SUBSCRIBE_TO_CHANGES, data);
    };

    const unsubscibeToChanges = (data: Partial<SubscribeToChangeData>) => {
      dispatch(realtimeSystemActions.removeRealtimeState(data));
      socket?.emit(chatEvents.UNSUBSCRIBE_TO_CHANGES, data);
    };

    return {
      subscribeToChanges,
      unsubscibeToChanges,
      isSocketLoaded: !!socket && !!dispatch
    }

  }, [dispatch, socket]);
  return result;
}

export default useRealtimeSystemEmitter;