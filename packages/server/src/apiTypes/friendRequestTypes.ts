import { User } from "./userTypes";

export type RequestResponse = {
  uuid: string;
  requester: User;
  requested: User;
  createdAt: string | Date;
  updatedAt: string | Date;
}


// наш реквест

// реквест стороннего чувака

export type RequestsInfo = {
  userRequests: {
    uuid: string;
    requesterUuid: string;
    requestedName: string;
    avaPath: string;
  }[];
  requestsToUser: {
    uuid: string;
    requestedUuid: string;
    requesterName: string;
    avaPath: string;
  }[];
}