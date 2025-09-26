import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

console.log("SID:", process.env.TWILIO_SID);
console.log("TOKEN:", process.env.TWILIO_AUTH_TOKEN);
console.log("PHONE:", process.env.TWILIO_PHONE_NUMBER);

const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

client.messages
    .create({
        body: 'Test SMS',
        from: process.env.TWILIO_PHONE_NUMBER,
        to: '+918904988107',
    })
    .then(msg => console.log('Message sent:', msg.sid))
    .catch(err => console.error(err));