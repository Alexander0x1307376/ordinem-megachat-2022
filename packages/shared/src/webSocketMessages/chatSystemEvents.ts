export enum ChatSystemEvents {

  JOIN_CHANNEL = 'JOIN_CHANNEL',
  JOIN_CHANNEL_SUCCESS = 'JOIN_CHANNEL_SUCCESS',
  JOIN_CHANNEL_ERROR = 'JOIN_CHANNEL_ERROR',
  LEAVE_CHANNEL = 'LEAVE_CHANNEL',

  
  REQUEST_CHAT_MESSAGES = 'REQUEST_CHAT_MESSAGES',
  REQUEST_CHAT_MESSAGES_SUCCESS = 'REQUEST_CHAT_MESSAGES_SUCCESS',
  REQUEST_CHAT_MESSAGES_ERROR = 'REQUEST_CHAT_MESSAGES_ERROR',

  SEND_MESSAGE = 'SEND_MESSAGE',
  SEND_MESSAGE_SUCCESS = 'SEND_MESSAGE_SUCCESS',
  SEND_MESSAGE_ERROR = 'SEND_MESSAGE_ERROR',

  
  UPDATE_MESSAGES = 'UPDATE_MESSAGES'
}