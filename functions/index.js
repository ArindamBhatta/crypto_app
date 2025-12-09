const functions = require("firebase-functions");
const { log } = require("firebase-functions/logger");

console.log("😎😎😎 Hello from Firebase Functions (emulator)! 😎😎😎");

exports.helloWorld = functions.https.onRequest((req, res) => {
  res.send("😎😎😎 Hello from Firebase Functions (emulator)! 😎😎😎");
});
