import 'reflect-metadata';
import { injectable } from "inversify";
import EntityEventEmitter from "../../common/EntityEventEmitter";
import { Channel as ChannelItem } from "@ordinem-megachat-2022/shared";


@injectable()
export class ChannelEventEmitter extends EntityEventEmitter<ChannelItem, ChannelItem, ChannelItem> { 
  constructor() {
    super();
  }
};