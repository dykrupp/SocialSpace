import * as functions from 'firebase-functions';

//allows client to easily determine new unread messages for the user w/o getting ALL messages back
export const updateChatInfo = functions.database
  .ref('/chats/{pushID}/messages')
  .onWrite(async (change, context) => {
    const collectionRef = change.after.ref.parent;
    if (!collectionRef || !collectionRef.parent) return null;

    const chatUID = collectionRef.key;
    if (!chatUID) return null;

    const chatUIDRef = collectionRef.parent.parent
      ?.child('chatUIDS')
      .child(chatUID);
    if (!chatUIDRef) return null;

    await chatUIDRef.child('lastWriteUID').transaction(() => context.auth?.uid);

    await chatUIDRef
      .child('lastWriteTime')
      .transaction(() => new Date().toUTCString());

    return null;
  });
