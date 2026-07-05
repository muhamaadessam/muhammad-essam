import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Fetch telegram config from Firestore
    const configDoc = await getDoc(doc(db, 'config', 'telegram'));
    if (!configDoc.exists()) {
      return NextResponse.json({ error: 'Config not found' }, { status: 500 });
    }

    const data = configDoc.data();
    const botToken = data.bot_token;
    const chatId = data.chat_id;

    if (!botToken || !chatId) {
      return NextResponse.json({ error: 'Telegram config missing' }, { status: 500 });
    }

    const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in contact API:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
