import EventEmitter from "events";


enum ServiceEvents {
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
    onCreated: (callback: (data: EventParam) => void) => void;
    onUpdated: (callback: (data: EventParam) => void) => void;
    onRemoved: (callback: (data: EventParam) => void) => void;
    offCreated: (callback: (data: EventParam) => void) => void;
    offUpdated: (callback: (data: EventParam) => void) => void;
    offRemoved: (callback: (data: EventParam) => void) => void;
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
  
  const service = {
    create: handleCreate,
    update: handleUpdate,
    remove: handleRemove,
    emitter: {
      onCreated: (callback: (data: ItemData) => void) => {
        emitter.on(ServiceEvents.ENTITY_CREATED, callback);
      },
      onUpdated: (callback: (data: ItemData) => void) => {
        emitter.on(ServiceEvents.ENTITY_UPDATED, callback);
      },
      onRemoved: (callback: (data: ItemData) => void) => {
        emitter.on(ServiceEvents.ENTITY_REMOVED, callback);
      },
      offCreated: (callback: (data: ItemData) => void) => {
        emitter.off(ServiceEvents.ENTITY_CREATED, callback);
      },
      offUpdated: (callback: (data: ItemData) => void) => {
        emitter.off(ServiceEvents.ENTITY_UPDATED, callback);
      },
      offRemoved: (callback: (data: ItemData) => void) => {
        emitter.off(ServiceEvents.ENTITY_REMOVED, callback);
      }
    } as ChangeDataEventEmitter<ItemData>
  }
  return service;
}

export default createChangeDataEventEmitter;