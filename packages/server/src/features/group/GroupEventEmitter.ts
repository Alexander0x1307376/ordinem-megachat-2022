import 'reflect-metadata';
import { injectable } from "inversify";
import EntityEventEmitter from "../../common/EntityEventEmitter";
import { GroupResponse } from '@ordinem-megachat-2022/shared';

@injectable()
export class GroupEventEmitter extends EntityEventEmitter<GroupResponse, GroupResponse> {
  constructor() {
    super();
  }
}