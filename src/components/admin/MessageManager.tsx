'use client';

import { useState, useEffect } from 'react';
import { getMessages, deleteMessage, markMessageAsRead } from '@/lib/adminServices';
import { Message } from '@/lib/services';
import { Trash2, Mail, MailOpen } from 'lucide-react';

export default function MessageManager() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const data = await getMessages();
    setMessages(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this message?')) {
      try {
        await deleteMessage(id);
        fetchMessages();
      } catch (err) {
        console.error(err);
        alert('Error deleting message');
      }
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead(id);
      fetchMessages();
    } catch (err) {
      console.error(err);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Just now';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'short'
    }).format(date);
  };

  if (loading) return <div>Loading messages...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Inbox ({messages.length})</h2>
      </div>

      {messages.length === 0 ? (
        <div className="text-center text-gray-400 py-12 glass rounded-xl border border-white/10">
          No messages found.
        </div>
      ) : (
        <div className="grid gap-4">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`glass p-6 rounded-xl border transition-colors relative ${msg.read ? 'border-white/5 opacity-80' : 'border-primary/50'}`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-lg text-white flex items-center gap-2">
                    {msg.name} 
                    {!msg.read && <span className="text-[10px] bg-primary text-dark-bg px-2 py-0.5 rounded-full font-bold">NEW</span>}
                  </h3>
                  <a href={`mailto:${msg.email}`} className="text-sm text-primary hover:underline">{msg.email}</a>
                </div>
                <div className="text-xs text-gray-400">
                  {formatDate(msg.createdAt)}
                </div>
              </div>
              
              <div className="bg-black/20 p-4 rounded-lg text-gray-300 text-sm whitespace-pre-wrap mb-4">
                {msg.message}
              </div>

              <div className="flex justify-end gap-3">
                {!msg.read && (
                  <button 
                    onClick={() => handleMarkAsRead(msg.id)} 
                    className="flex items-center gap-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <MailOpen className="w-4 h-4" /> Mark as Read
                  </button>
                )}
                <button 
                  onClick={() => handleDelete(msg.id)} 
                  className="flex items-center gap-1 text-sm text-red-500/80 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="w-4 h-4" /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
