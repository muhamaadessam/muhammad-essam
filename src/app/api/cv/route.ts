import { NextResponse } from 'next/server';
import { doc, getDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cookies } from 'next/headers';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get('visitor_id')?.value || 'Unknown';

    // Increment Firestore stats
    const statsDoc = doc(db, 'stats', 'cv_downloads');
    await updateDoc(statsDoc, {
      count: increment(1)
    }).catch(() => {
      // Ignore if document doesn't exist yet or permission denied
    });

    // Send Telegram Notification
    const configDoc = await getDoc(doc(db, 'config', 'telegram'));
    if (configDoc.exists()) {
      const data = configDoc.data();
      const botToken = data.bot_token;
      const chatId = data.chat_id;

      if (botToken && chatId) {
        const message = `📄 *CV Downloaded!*\n\n*Visitor ID:* \`${visitorId}\`\nSomeone just downloaded your CV!`;

        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;
        await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown',
          }),
        });
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error tracking CV download:', error);
    return NextResponse.json({ error: 'Failed to track download' }, { status: 500 });
  }
}
