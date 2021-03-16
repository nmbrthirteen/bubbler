const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();
const settings = { timestampsInSnapshots: true };
db.settings(settings);

export const archiveChat = functions.firestore
  .document("chats/{chatId}")
  .onUpdate((change) => {
    const data = change.after.data();

    const maxLen = 50;
    const msgLen = data.messages.length;
    const charLen = JSON.stringify(data).length;

    if (charLen >= 10000 || msgLen >= maxLen) {
      const batch = db.batch();
      data.messages.splice(0, msgLen - maxLen);
      const ref = db.collection("chats").doc(change.after.id);
      batch.set(ref, data, { merge: true });
      return batch.commit();
    } else {
      return null;
    }
  });

exports.addLike = functions.firestore
  .document("/posts/{creatorId}/userPosts/{postId}/likes/{userId}")
  .onCreate((snap, context) => {
    return db
      .collection("posts")
      .doc(context.params.creatorId)
      .collection("userPosts")
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(1),
      });
  });
exports.removeLike = functions.firestore
  .document("/posts/{creatorId}/userPosts/{postId}/likes/{userId}")
  .onDelete((snap, context) => {
    return db
      .collection("posts")
      .doc(context.params.creatorId)
      .collection("userPosts")
      .doc(context.params.postId)
      .update({
        likesCount: admin.firestore.FieldValue.increment(-1),
      });
  });
