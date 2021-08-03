const db = require("../../data/db");

const addConversation = async (conversation) => {
    const conversationInfo = await db("Conversation").select('*')
    .where({members: [conversation.senderId, conversation.receiverId]})
    .orWhere({members: [conversation.receiverId, conversation.senderId]})
    
    
    console.log('im here');
    console.log('convo',  conversationInfo)

    if (conversationInfo.length === 0) {
      // make sure no convo exists with the two same users (prevent dupe);
      const newlyInsteredConvo = await db("Conversation").insert(conversation)

      const newlyAddedConvo = await db("Conversation").select('*')
      .where({members: [conversation.senderId, conversation.receiverId]})
      .orWhere({members: [conversation.receiverId, conversation.senderId]}).first()

      console.log('newlyAdded',  newlyAddedConvo)

      return newlyAddedConvo
    } else {
      return conversationInfo[0]
    }
  };

const getConversation = async (filter) => {
  console.log(filter);
  // get Logged in user conversation, and return the sender / receiver id

  const conversationInfo = await db("Conversation")
    .join("User", "User.id", "Conversation.receiverId")
    .select(
      "User.id as uid",
      "Conversation.id as cid",
      "Conversation.senderId",
      "Conversation.receiverId",
    ).where(filter).first();

    console.log(conversationInfo);
  // Get the sender user information based off the conversation senderId
  const senderInfo = await db("User")
    .select(
      "User.username as senderUsername",
      "User.avatar as senderAvatar",
      "User.discord_id as senderDiscordId",
    ).where({id: conversationInfo.senderId}).first();

    console.log(senderInfo);


  // get the last message from the conversation between the two users.
  const messageInfo = await db("Message")
  .join("User", "User.id", "Conversation.receiverId")
    .select(
      "Message.text",
      "Message.updated_at",
    ).where({conversationId: conversationInfo.cid});

    console.log(messageInfo);
  return [{...conversationInfo, ...senderInfo, ...messageInfo[messageInfo.length - 1]}];

};
const getConversationNew = async (filter) => {
  const conversationInfo = await db("Conversation").select('*').whereRaw('? = ANY(members)', filter.userId);
  return conversationInfo
}
const getSingleConversationMessages = async (filter) => {
  const messageInfo = await db("Message")
  .join('User', "User.id", "Message.senderId")
    .select(
      "User.username",
      "User.avatar ",
      "User.discord_id ",
      "Message.text",
      "Message.created_at",
    ).where({conversationId: filter.cid});

    return messageInfo;
}
const getLastMessage = async (filter) => {
  const lastMessage = await db("Message")
  .join("User", "User.id", "Message.senderId")
  .select(
    "Message.id",
    "Message.text",
    "Message.conversationId",
    "User.id",
    "User.username",
    "User.avatar",
    "User.discord_id",
    "Message.created_at",
    "Message.read"

  ).where(filter);

  return lastMessage;
};

const addMessage = async (newMessage) => {
  console.log('newMessage',newMessage);
    await db("Message").insert(newMessage);
    const filter = {conversationId: newMessage.conversationId}
    const message = await getLastMessage(filter)
  console.log('getLastMessage message', message)
    return message;
}


const getMessages = async (filter) => {
  const messages = await db("Conversation")
  .join("Message", "Message.conversationId","Conversation.id")
  .select(
    "Message.id",
    "Message.text",
    "Message.conversationId",
    "Message.created_at",
    "Message.read"
  )
  .whereRaw('? = ANY(members)', filter.userId);
    console.log(messages)

  const senderInfo = await db("User")
  .select(
    "User.username as senderUsername",
    "User.avatar as senderAvatar",
    "User.discord_id as senderDiscordId",
  ).where({id: filter.userId}).first();
    console.log(senderInfo)

  return messages;
};

const getWeekOldMessages = async (filter, date,) => {
// information needed to get specific week old Messages
// 1) conversation_id 
// 2) our current_date - 1 week || if there is a passed in date, then reduce that by 1 week 

console.log(filter)
console.log(date)
  // const messages = await db("Message")
  // .select(
  //   "Message.id",
  //   "Message.text",
  //   "Message.conversationId",
  //   "User.id",
  //   "User.username",
  //   "User.avatar",
  //   "User.discord_id",
  //   "Message.created_at"
  // ).where(filter);

  // return lastMessage;
};
const getUser = async (user) => {
  const senderInfo = await db("User")
  .select(
    "User.username",
    "User.avatar",
    "User.discord_id",
  ).where({id: user.id}).first();
  console.log(senderInfo);
  return senderInfo;
}
  module.exports = {
    addConversation,
    getConversation,
    addMessage,
    getLastMessage,
    getConversationNew,
    getMessages,
    getWeekOldMessages,
    getSingleConversationMessages,
    getUser,
  };