import { ControllerMethod } from "../../types";
import { controllerFunction as cf } from '../controller';
import { IChannelService } from "./channelService";


export interface IChannelController {
  list: ControllerMethod;
  show: ControllerMethod;
  create: ControllerMethod;
  update: ControllerMethod;
  remove: ControllerMethod;
}

const createChannelController = ({channelService}: {
  channelService: IChannelService
}) => {
  const channelController: IChannelController = {
    list: cf(async (req: any, res) => {
      const { groupId } = req.params;
      const result = await channelService.getList(groupId);
      res.json(result);
    }),
    
    show: cf(async (req: any, res) => {
      const { channelId } = req.params;
      const result = await channelService.getChannelDetails(channelId);
      res.json(result);
    }),

    create: cf(async (req: any, res) => {
      const postData = req.body;
      const result = await channelService.createChannel(postData);
      res.json(result);
    }),
    
    update: cf(async (req: any, res) => {
      const { channelId } = req.params;
      const postData = req.body;
      const result = await channelService.updateChannel(channelId, postData);
      res.json(result);
    }),
    
    remove: cf(async (req: any, res) => {
      const { channelId } = req.params;
      const result = await channelService.removeChannel(channelId);
    })
  }
  return channelController;
}

export default createChannelController;