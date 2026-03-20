const admin = require('firebase-admin');
const serviceAccount = require('./flatsync-e39f0-firebase-adminsdk-fbsvc-fcf6b9362a.json'); 

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
    console.log("Firebase Admin Initialized! ✅");
}

module.exports = admin;