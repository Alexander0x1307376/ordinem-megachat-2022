import 'reflect-metadata';
import { injectable } from "inversify";
import EntityEventEmitter from "../../common/EntityEventEmitter";

@injectable()
export class GroupEventEmitter extends EntityEventEmitter {
  constructor() {
    super();
  }
}