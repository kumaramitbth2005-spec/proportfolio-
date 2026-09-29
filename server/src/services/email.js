import { Resend } from 'resend';

const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export async function notifyOwner(subject, text) {
  if (!resend || !process.env.OWNER_EMAIL || !process.env.EMAIL_FROM) {
    console.warn('Email config missing. Ensure RESEND_API_KEY, OWNER_EMAIL, and EMAIL_FROM are set.');
    return false;
  }
  
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.OWNER_EMAIL,
      subject,
      text
    });
    return true;
  } catch (error) {
    console.error('Failed to notify owner via Resend:', error);
    return false;
  }
}

export async function sendChatEmailToOwner(session, messageObj) {
  if (!resend || !process.env.OWNER_EMAIL || !process.env.EMAIL_FROM) {
    console.warn('Email config missing for chat notifications.');
    return null;
  }

  const subject = `New Portfolio Message — ${session.visitorName}`;
  const text = `New message from your portfolio.\n\nName:\n${session.visitorName}\n\nEmail:\n${session.visitorEmail}\n\nMessage:\n${messageObj.message}\n\nConversation ID:\n${session._id}`;

  const headers = {};
  
  // Only set Reply-To if EMAIL_REPLY_ADDRESS is configured, otherwise fallback to visitor email for direct reply, but we prefer webhook
  const replyTo = process.env.EMAIL_REPLY_ADDRESS || session.visitorEmail;

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: process.env.OWNER_EMAIL,
      replyTo,
      subject,
      text,
      headers
    });
    return data; // { id: '...' }
  } catch (error) {
    console.error('Failed to send chat email via Resend:', error);
    return null;
  }
}

export async function sendChatEmailToVisitor(session, messageObj, previousMessageId) {
  if (!resend || !process.env.EMAIL_FROM) {
    return null;
  }

  const subject = `Re: New Portfolio Message — ${session.visitorName}`;
  const text = `Hi ${session.visitorName},\n\nYou have a new reply:\n\n${messageObj.message}\n\nTo continue the conversation, please visit the portfolio chat.`;

  const headers = {};
  if (previousMessageId) {
    headers['In-Reply-To'] = previousMessageId;
    headers['References'] = previousMessageId;
  }

  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: session.visitorEmail,
      subject,
      text,
      headers
    });
    return data;
  } catch (error) {
    console.error('Failed to send chat email to visitor via Resend:', error);
    return null;
  }
}
