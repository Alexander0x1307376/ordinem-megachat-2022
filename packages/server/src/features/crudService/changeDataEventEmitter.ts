import EventEmitter from "events";


// Обобщённый CRUD сервис
// На выходе получаем методы и события


export enum ServiceEvents {
  ENTITY_CREATED = 'ENTITY_CREATED',
  ENTITY_UPDATED = 'ENTITY_UPDATED',
  ENTITY_REMOVED = 'ENTITY_REMOVED'
}

interface CreateServiceInitialData<ItemData> {
  methods: {
    create: (...params: any[]) => Promise<ItemData> | ItemData;
    update: (...params: any[]) => Promise<ItemData> | ItemData;
    remove: (...params: any[]) => Promise<ItemData> | ItemData;
  }
}

export interface ChangeDataEventEmitter<EventParam> {
  on: (event: ServiceEvents, callback: (data: EventParam) => void) => void;
  off: (event: ServiceEvents, callback: (data: EventParam) => void) => void;
}

const createChangeDataEventEmitter = <ItemData>
  (initialData: CreateServiceInitialData<ItemData>) => {


  const { methods } = initialData;
  
  const emitter = new EventEmitter();

  const handleCreate = async (...params: Parameters<typeof initialData.methods.create>) => {
    const result = await methods.create(...params);
    emitter.emit(ServiceEvents.ENTITY_CREATED, result);
    return result;
  }

  const handleUpdate = async (...params: Parameters<typeof initialData.methods.update>) => {
    const result = await methods.update(...params);
    emitter.emit(ServiceEvents.ENTITY_UPDATED, result);
    return result;
  }

  const handleRemove = async (...params: Parameters<typeof initialData.methods.remove>) => {
    const result = await methods.remove(...params);
    emitter.emit(ServiceEvents.ENTITY_REMOVED, result);
    return result;
  }

  const on = (eventName: ServiceEvents, callback: (...params: any) => void) => {
    emitter.on(eventName, callback);
  }  

  const off = (eventName: ServiceEvents, callback: (...params: any) => void) => {
    emitter.off(eventName, callback);
  }

  const service = {
    create: handleCreate,
    update: handleUpdate,
    remove: handleRemove,
    on, off
  }
  return service;
}

export default createChangeDataEventEmitter;