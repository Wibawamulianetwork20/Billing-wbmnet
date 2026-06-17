const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const uid = process.argv[2];

if (!uid) {
  console.log('Usage: node set-admin.js eicrqY8OPfZLgfoWIfv0pCmOBrJ2');
  process.exit(1);
}

admin.auth().setCustomUserClaims(uid, { admin: true })
 .then(() => {
    console.log('Sukses! UID', uid, 'sekarang jadi admin');
    process.exit(0);
  })
 .catch(error => {
    console.log('Error:', error);
    process.exit(1);
  });
