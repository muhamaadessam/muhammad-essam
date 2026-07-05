import { NextResponse } from 'next/server';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    let visitorId = cookieStore.get('visitor_id')?.value;
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = Date.now().toString();
      isNewVisitor = true;
    }

    const docRef = doc(db, 'stats', 'visitors');
    const snapshot = await getDoc(docRef);
    
    let totalVisits = 1;
    let totalVisitors = 1;

    if (snapshot.exists()) {
      const data = snapshot.data();
      const users = data.users || {};
      const currentCount = users[visitorId] || 0;
      
      isNewVisitor = currentCount === 0;
      totalVisitors = isNewVisitor ? Object.keys(users).length + 1 : Object.keys(users).length;
      totalVisits = (data.total_visites || 0) + 1;

      await setDoc(docRef, {
        total_visitors: isNewVisitor ? increment(1) : Object.keys(users).length,
        total_visites: increment(1),
        users: {
          ...users,
          [visitorId]: currentCount + 1,
        }
      }, { merge: true });
    } else {
      await setDoc(docRef, {
        total_visitors: 1,
        total_visites: 1,
        users: {
          [visitorId]: 1,
        }
      });
    }

    // Send Telegram Notification
    const configDoc = await getDoc(doc(db, 'config', 'telegram'));
    if (configDoc.exists()) {
      const data = configDoc.data();
      const botToken = data.bot_token;
      const chatId = data.chat_id;

      if (botToken && chatId) {
        let message;
        if (isNewVisitor) {
          message = `🎉 *New Unique Visitor!*\n\n*Visitor ID:* \`${visitorId}\`\nA new user has visited your portfolio!\nTotal Unique Visitors: \`${totalVisitors}\``;
        } else {
          message = `👀 *Portfolio Visit!*\n\n*Visitor ID:* \`${visitorId}\`\nA return visitor just opened your portfolio.\nTotal Visits: \`${totalVisits}\``;
        }

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

    const response = NextResponse.json({ success: true, visitorId });
    if (isNewVisitor) {
      response.cookies.set('visitor_id', visitorId, { maxAge: 60 * 60 * 24 * 365 });
    }
    
    return response;
  } catch (error) {
    console.error('Error tracking visitor:', error);
    return NextResponse.json({ error: 'Failed to track visitor' }, { status: 500 });
  }
}
