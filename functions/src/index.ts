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

  export const createLikeNotification = functions.database.ref('/posts/{userUID}/{postUID}/likes/{likeUID}').onCreate((snapShot, context) => {
    const root = snapShot.ref.parent?.parent?.parent?.parent?.parent;
    if (root) {
      return root.ref.child(`/notifications/${context.params.userUID}/${context.params.likeUID}`).set({
        triggerUserUID: snapShot.val().userUID,
        type: 'like',
        read: false,
      })
    } else return null;
  });

  export const removeLikeNotification = functions.database.ref('/posts/{userUID}/{postUID}/likes/{likeUID}').onDelete((snapShot, context) => {
    const root = snapShot.ref.parent?.parent?.parent?.parent?.parent;
    return root ? root.ref.child(`/notifications/${context.params.userUID}/${context.params.likeUID}`).remove() : null;
  });

  export const createCommentNotification = functions.database.ref('/posts/{userUID}/{postUID}/comments/{commentUID}').onCreate((snapShot, context) => {
    const root = snapShot.ref.parent?.parent?.parent?.parent?.parent;
    if (root) {
      return root.ref.child(`/notifications/${context.params.userUID}/${context.params.commentUID}`).set({
        triggerUserUID: snapShot.val().userUID,
        type: 'comment',
        read: false,
      })
    } else return null;
  });

  export const removeCommentNotification = functions.database.ref('/posts/{userUID}/{postUID}/comments/{commentUID}').onDelete((snapShot, context) => {
    const root = snapShot.ref.parent?.parent?.parent?.parent?.parent;
    if (root) return root.ref.child(`/notifications/${context.params.userUID}/${context.params.commentUID}`).remove();
    else return null;
  });

  export const createFollowerNotification = functions.database.ref('/users/{userUID}/followers/{followerUID}').onCreate((snapShot, context) => {
    const root = snapShot.ref.parent?.parent?.parent?.parent;
    if (root) {
      return root.ref.child(`/notifications/${context.params.userUID}/${context.params.followerUID}`).set({
        triggerUserUID: snapShot.val().userUID,
        type: 'follower',
        read: false,
      })
    } else return null;
  });

  export const deleteFollowerNotification = functions.database.ref('/users/{userUID}/followers/{followerUID}').onDelete((snapShot, context) => {
    const root = snapShot.ref.parent?.parent?.parent?.parent;
    if (root) return root.ref.child(`/notifications/${context.params.userUID}/${context.params.followerUID}`).remove();
    else return null;
  });


