export type SubscribeToChangeData = {
  users: string[];
  groups: string[];
  rooms: string[];
}

export type ChangeData = Record<string, {
  data: any,
  changeType: 'replace' | 'merge' | 'remove'
}>