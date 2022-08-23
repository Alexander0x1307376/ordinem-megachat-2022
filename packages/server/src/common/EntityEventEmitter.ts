import 'reflect-metadata';
import EventEmitter from "events";
import { injectable } from "inversify";


export enum EventTypes {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  REMOVED = "REMOVED"
}

@injectable()
class EntityEventEmitter<
  CreatedType = any, 
  UpdatedType = any, 
  RemovedType = any
> {

  emitter: EventEmitter;

  constructor() {
    this.emitter = new EventEmitter();
  }

  public emitCreated(data: CreatedType) {
    this.emitter.emit(EventTypes.CREATED, data);
  }
  public emitUpdated(data: UpdatedType) {
    this.emitter.emit(EventTypes.UPDATED, data);
  }
  public emitRemoved(data: RemovedType) {
    this.emitter.emit(EventTypes.REMOVED, data);
  }

  public onCreated(callback: (data: CreatedType) => void) {
    this.emitter.on(EventTypes.CREATED, callback);
  }
  public onUpdated(callback: (data: UpdatedType) => void) {
    this.emitter.on(EventTypes.UPDATED, callback);
  }
  public onRemoved(callback: (data: RemovedType) => void) {
    this.emitter.on(EventTypes.REMOVED, callback);
  }

  public offCreated(callback: (data: CreatedType) => void) {
    this.emitter.off(EventTypes.CREATED, callback);
  }
  public offUpdated(callback: (data: UpdatedType) => void) {
    this.emitter.off(EventTypes.UPDATED, callback);
  }
  public offRemoved(callback: (data: RemovedType) => void) {
    this.emitter.off(EventTypes.REMOVED, callback);
  }

}

export default EntityEventEmitter;