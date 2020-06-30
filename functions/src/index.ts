import * as functions from 'firebase-functions';

const messageCount = 'messageCount';

//allows client to easily determine new unread messages for the user w/o getting ALL messages back
export const updateMessageCount = functions.database
  .ref('/chats/{pushID}/messages')
  .onWrite(async (change, context) => {
    const collectionRef = change.after.ref.parent;
    if (!collectionRef || !collectionRef.parent) return null;

    let modifier = 0;
    if (
      (change.after.exists() && !change.before.exists()) ||
      (change.after.exists() && change.before.exists())
    ) {
      modifier = 1;
    } else if (!change.after.exists() && change.before.exists()) {
      modifier = -1;
    } else {
      return null;
    }

    const chatUID = collectionRef.key;
    if (!chatUID) return null;

    const chatUIDRef = collectionRef.parent.parent
      ?.child('chatUIDS')
      .child(chatUID);
    if (!chatUIDRef) return null;

    await chatUIDRef.child(messageCount).transaction((current) => {
      return change.after.val() !== null ? (current || 0) + modifier : 0;
    });

    await chatUIDRef.child('lastWriteUID').transaction(() => context.auth?.uid);

    return null;
  });

//Fixes the database if the message_count is deleted
export const recountMessages = functions.database
  .ref(`/chatUIDS/{pushID}/${messageCount}`)
  .onDelete(async (snapShot) => {
    const counterRef = snapShot.ref;
    const chatUID = snapShot.ref.parent?.key;

    //don't recreate node if the messages are empty
    if (snapShot.val() === 0) return;

    if (!counterRef || !chatUID) return null;

    const collectionRef = counterRef.parent?.parent?.parent
      ?.child('chats')
      .child(chatUID)
      .child('messages');
    if (!collectionRef) return null;

    const messagesData = await collectionRef.once('value');
    await counterRef.set(messagesData.numChildren());
    return null;
  });
