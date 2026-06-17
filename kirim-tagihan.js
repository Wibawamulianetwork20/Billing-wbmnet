const admin = require('firebase-admin');
admin.initializeApp({ credential: admin.credential.applicationDefault() });

const uid = process.argv[2];
const jumlah = process.argv[3];

admin.firestore().collection('users').doc(uid).get().then(doc => {
  const token = doc.data().fcmToken;
  return admin.messaging().send({
    token: token,
    notification: { title: 'Tagihan Baru', body: `Tagihan Rp${jumlah} masuk` },
    webpush: { fcmOptions: { link: '/pelanggan.html' } }
  });
}).then(() => console.log('Notifikasi terkirim!'));