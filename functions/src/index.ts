import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//

//TODO -> Just added as a proof in concept for Cloud Functions -> used to call on the client side
// const onMessageClick = (): void => {
//   if (firebase) {
//     const helloWorld = firebase.functions.httpsCallable('helloWorld');
//     helloWorld().then((result) => console.log(result));
//   }
// };

export const helloWorld = functions.https.onCall((data, context) => {
  return `Hello ${context.auth?.token.name}, Firebase Cloud Functions says hi!`;
});
