import * as functions from 'firebase-functions';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
export const helloWorld = functions.https.onCall((data, context) => {
  return `Hello ${context.auth?.token.name}, Firebase Cloud Functions says hi!`;
});
