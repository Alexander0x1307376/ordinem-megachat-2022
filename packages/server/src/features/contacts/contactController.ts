import { ControllerMethod } from '../../types';
import { controllerFunction as cf } from '../controller';
import { IContactService } from './contactService';

export interface IContactController {
  getContactsData: ControllerMethod;

}

const createContactController = ({contactService}: {
  contactService: IContactService
}) => {

  const contactController: IContactController = {
    getContactsData: cf(async (req: any, res) => {
      const userUuid = req.user.uuid;
      const result = await contactService.getUserContacts(userUuid);
      res.json(result);
    }),
  }

  return contactController;
}

export default createContactController;