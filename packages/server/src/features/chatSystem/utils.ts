import { Socket } from "socket.io";


const channelPrefix = 'channel_';
const groupPrefix = 'group_';
const observeUserPrefix = 'userObserve_';

export const getChannelRoomName = (channelUuid: string) => 
  channelPrefix + channelUuid;

export const getGroupRoomName = (channelUuid: string) => 
  groupPrefix + channelUuid;

export const getObserveUserRoomName = (userUuid: string) => 
  observeUserPrefix + userUuid;

export const isSocketInRoom = (socket: Socket, room: string) => 
  socket.rooms.has(room);

export const getSocketChannels = (socket: Socket) => getRoomsByPrefix(socket, channelPrefix);

export const getSocketGroups = (socket: Socket) => getRoomsByPrefix(socket, groupPrefix);

const getRoomsByPrefix = (socket: Socket, prefix: string) => {
  const result: string[] = [];
  for (let [key, val] of socket.rooms) {
    if (val.substring(0, prefix.length) === prefix)
      result.push(val);
  }
  return result;
}

// TODO: разобраться, будет ли пользователь одновременно подключён к одному каналу или всё же к нескольким
export const joinChannelRoom = (socket: Socket, channelUuid: string) => {
  socket.join(getChannelRoomName(channelUuid));
}
// export const joinChannelRoom = (socket: Socket, channelUuid: string) => {
//   const channelName = getChannelRoomName(channelUuid);
//   const channels = getSocketChannels(socket);

//   if (channels.length && channels[0] !== channelName) {
//     socket.leave(channelName);
//   }
//   socket.join(channelName);
// }

export const joinGroupRoom = (socket: Socket, groupUuid: string) => {
  socket.join(getGroupRoomName(groupUuid));
}

export const leaveGroupRoom = (socket: Socket, groupUuid: string) => {
  socket.leave(getGroupRoomName(groupUuid));
}

export const leaveChannelRoom = (socket: Socket, channelUuid: string) => {
  socket.leave(getChannelRoomName(channelUuid));
}

export const observeUser = (socket: Socket, userUuid: string) => {
  socket.join(getObserveUserRoomName(userUuid));
}

export const unobserveUser = (socket: Socket, userUuid: string) => {
  socket.leave(getObserveUserRoomName(userUuid));
}