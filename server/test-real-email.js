import dotenv from 'dotenv';
import { sendOtpEmail } from './mailer.js';

dotenv.config();

const testRecipient = process.argv[2] || process.env.TEST_EMAIL;

if (!testRecipient) {
  console.log('\n❌ Usage: node test-real-email.js <your-real-email@gmail.com>');
  console.log('Example: node test-real-email.js myemail@gmail.com\n');
  process.exit(1);
}

console.log(`\n✉️ Sending test 6-digit verification code email to: ${testRecipient}...`);

sendOtpEmail(testRecipient, '582914', 'signup')
  .then((res) => {
    console.log(`\n🎉 Verification email dispatched! Check inbox for ${testRecipient}\n`);
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n❌ Failed to send email:', err.message);
    process.exit(1);
  });
