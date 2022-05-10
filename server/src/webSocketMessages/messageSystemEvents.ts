export enum MessageSystemEvents {
  // запросить информацию обо всех реквестах, имеющие отношение к нам
  REQUEST_INFO = 'REQUEST_INFO',
  // при получении инфы о реквестах
  REQUEST_INFO_IS_SENT = 'REQUEST_INFO_IS_SENT',

  // запросы, отправляемые нами
  SEND_FRIEND_REQUEST = 'SEND_FRIEND_REQUEST',
  RECALL_FRIEND_REQUEST = 'RECALL_FRIEND_REQUEST',


  ACCEPT_FRIEND_REQUEST = 'ACCEPT_FRIEND_REQUEST',
  DECLINE_FRIEND_REQUEST = 'DECLINE_FRIEND_REQUEST',

  // входящие запросы
  INCOMING_FRIEND_REQUEST = 'INCOMING_FRIEND_REQUEST'
}
