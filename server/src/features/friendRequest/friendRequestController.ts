import { controllerFunction as cf } from '../controller';
import friendRequestService from './friendRequestService';


export default {


  
  requests: cf(async (req: any, res) => {
    const userUuid = req.user.uuid;
    const result = await friendRequestService.getRequests(userUuid);
    res.json(result);
  }),

  create: cf(async (req: any, res) => {

    const { requestedUuid } = req.params;
    const userUuid = req.user.uuid;
    const result = await friendRequestService.createRequest(userUuid, requestedUuid);
    res.json(result);

  }),

  recall: cf(async (req: any, res) => {

    const { requestUuid } = req.params;
    const userUuid = req.user.uuid;
    const result = await friendRequestService.cancelRequest(userUuid, requestUuid);
    res.json(result);

  }),

  accept: cf(async (req: any, res) => {

    const { requestUuid } = req.params;
    const userUuid = req.user.uuid;
    const result = await friendRequestService.acceptRequest(userUuid, requestUuid);
    res.json(result);

  }),

  reject: cf(async (req: any, res) => {

    const { requestUuid } = req.params;
    const userUuid = req.user.uuid;
    const result = await friendRequestService.rejectRequest(userUuid, requestUuid);
    res.json(result);

  }),



}