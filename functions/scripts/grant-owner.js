const admin = require('firebase-admin');

const email = process.argv[2];
if (!email || process.argv.length !== 3) {
    console.error('Usage: node scripts/grant-owner.js owner@example.com');
    process.exit(1);
}

admin.initializeApp({ projectId: 'biomednlp-8432a' });

async function main() {
    const user = await admin.auth().getUserByEmail(email);
    await admin.auth().setCustomUserClaims(user.uid, { ...user.customClaims, admin: true });
    console.log(`Owner access granted to ${user.email} (${user.uid}). Ask them to sign out and back in.`);
}

main().catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
