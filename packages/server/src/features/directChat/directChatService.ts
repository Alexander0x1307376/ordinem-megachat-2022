import { DataSource } from "typeorm";


export interface IDirectChatService {

}

const createDirectChatService = ({dataSource} : {dataSource: DataSource}) => {

  

  const service: IDirectChatService = {

  }
  return service;
}

export default createDirectChatService;