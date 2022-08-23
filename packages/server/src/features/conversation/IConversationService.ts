import { ConversationPostData, Conversation as ConversationType, ConversationWithMembers, ConversationFullPostData } from "@ordinem-megachat-2022/shared";




export interface IConversationService {
  createConveration: (userUuid: string, data: ConversationFullPostData) => Promise<ConversationType>;
  updateConveration: (userUuid: string, conversationUuid: string, data: ConversationPostData) => Promise<ConversationType>;
  removeConversation: (userUuid: string, conversationUuid: string) => Promise<ConversationType>;
  conversationsOfUser: (userUuid: string) => Promise<ConversationType[]>;
  addMembersToConversation: (userUuid: string, conversationUuid: string, memberUuids: string[]) => Promise<ConversationType>;
  removeMembersFromConversation: (userUuid: string, conversationUuid: string, memberUuids: string[]) => Promise<ConversationType>;
  conversationDetails: (userUuid: string, conversationUuid: string) => Promise<ConversationWithMembers>;
}
