import 'reflect-metadata';
import { injectable } from "inversify";
import EntityEventEmitter from "../../common/EntityEventEmitter";

@injectable()
export class UserEventEmitter extends EntityEventEmitter {
  constructor() {
    super();
  }
}