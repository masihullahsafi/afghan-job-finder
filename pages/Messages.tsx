
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { SEO } from '../components/SEO';
import { MessageSquare, Send, Search, User, Clock, Check, MoreVertical } from 'lucide-react';
import { User as UserType } from '../types';

export const Messages: React.FC = () => {
  const { t, user, chatMessages, sendChatMessage, markChatAsRead, allUsers } = useAppContext();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user) return <div>Access Denied</div>;

  const conversationUsers = Array.from(new Set(
      chatMessages
        .filter(msg => msg.senderId === user._id || msg.receiverId === user._id)
        .map(msg => msg.senderId === user._id ? msg.receiverId : msg.senderId)
  )).map(_id => allUsers.find(u => u._id === _id)).filter(Boolean) as UserType[];

  const activeUser = activeConversationId ? allUsers.find(u => u._id === activeConversationId) : null;
  const currentMessages = activeConversationId 
    ? chatMessages.filter(msg => (msg.senderId === user._id && msg.receiverId === activeConversationId) || (msg.senderId === activeConversationId && msg.receiverId === user._id))
    : [];

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!messageInput.trim() || !activeConversationId) return;
      sendChatMessage(activeConversationId, messageInput);
      setMessageInput('');
  };

  return (
    <div className="bg-gray-50 h-[calc(100vh-64px)] flex overflow-hidden">
      <aside className="w-80 bg-white border-r overflow-y-auto">{conversationUsers.map(u => <div key={u._id} onClick={() => setActiveConversationId(u._id)} className={`p-4 border-b cursor-pointer ${activeConversationId === u._id ? 'bg-blue-50' : ''}`}>{u.name}</div>)}</aside>
      <main className="flex-1 flex flex-col bg-white">
          {activeUser ? (
              <>
                  <div className="p-4 border-b font-bold">{activeUser.name}</div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">{currentMessages.map(msg => <div key={msg._id} className={`flex ${msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}><div className={`p-2 rounded-lg ${msg.senderId === user._id ? 'bg-primary-600 text-white' : 'bg-gray-100'}`}>{msg.content}</div></div>)}<div ref={messagesEndRef}/></div>
                  <form onSubmit={handleSend} className="p-4 border-t flex gap-2"><input value={messageInput} onChange={e => setMessageInput(e.target.value)} className="flex-1 border p-2 rounded"/><button className="bg-primary-600 text-white px-4 py-2 rounded">Send</button></form>
              </>
          ) : <div className="m-auto text-gray-400">Select a message</div>}
      </main>
    </div>
  );
};
