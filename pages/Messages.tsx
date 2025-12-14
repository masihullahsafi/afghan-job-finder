
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { SEO } from '../components/SEO';
import { MessageSquare, Send, Search, User, Clock, Check, MoreVertical } from 'lucide-react';
import { User as UserType } from '../types';

export const Messages: React.FC = () => {
  const { t, user, chatMessages, sendChatMessage, markChatAsRead, allUsers } = useAppContext();
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  if (!user) {
      return <div className="p-10 text-center text-red-600">{t('accessDenied')}</div>;
  }

  // Get list of unique users I've chatted with
  const conversationUsers = Array.from(new Set(
      chatMessages
        .filter(msg => msg.senderId === user.id || msg.receiverId === user.id)
        .map(msg => msg.senderId === user.id ? msg.receiverId : msg.senderId)
  )).map(id => allUsers.find(u => u.id === id)).filter(Boolean) as UserType[];

  // Filter conversations by search
  const filteredUsers = conversationUsers.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()));

  // Determine active user object
  const activeUser = activeConversationId ? allUsers.find(u => u.id === activeConversationId) : null;

  // Get messages for active conversation
  const currentMessages = activeConversationId 
    ? chatMessages.filter(msg => 
        (msg.senderId === user.id && msg.receiverId === activeConversationId) || 
        (msg.senderId === activeConversationId && msg.receiverId === user.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  // Scroll Behavior: Instant on conversation switch
  useEffect(() => {
      if (activeConversationId) {
          markChatAsRead(activeConversationId);
          setTimeout(() => {
              messagesEndRef.current?.scrollIntoView({ behavior: 'auto' });
          }, 0);
      }
  }, [activeConversationId]);

  // Scroll Behavior: Smooth on new message
  useEffect(() => {
      if (activeConversationId) {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [currentMessages.length]);

  const handleSend = (e: React.FormEvent) => {
      e.preventDefault();
      if (!messageInput.trim() || !activeConversationId) return;
      
      sendChatMessage(activeConversationId, messageInput);
      setMessageInput('');
  };

  // Helper to format time
  const formatTime = (isoString: string) => {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Helper to get last message for sidebar
  const getLastMessage = (otherUserId: string) => {
      const msgs = chatMessages.filter(msg => 
        (msg.senderId === user.id && msg.receiverId === otherUserId) || 
        (msg.senderId === otherUserId && msg.receiverId === user.id)
      ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      return msgs[msgs.length - 1];
  };

  const getUnreadCount = (otherUserId: string) => {
      return chatMessages.filter(msg => msg.senderId === otherUserId && msg.receiverId === user.id && !msg.isRead).length;
  };

  return (
    <div className="bg-gray-50 h-[calc(100vh-64px)] overflow-hidden">
      <SEO title="Messages" description="Your conversations" />
      
      <div className="container mx-auto h-full flex pt-4 pb-4 px-4 gap-4">
          
          {/* Sidebar */}
          <div className={`w-full md:w-1/3 bg-white rounded-2xl shadow-sm border border-gray-200 flex flex-col h-full overflow-hidden ${activeUser ? 'hidden md:flex' : 'flex'}`}>
              <div className="p-4 border-b border-gray-100">
                  <h2 className="text-xl font-bold text-gray-900 mb-4">{t('messages')}</h2>
                  <div className="relative">
                      <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"/>
                      <input 
                        type="text" 
                        placeholder={t('searchConversations')}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                      />
                  </div>
              </div>
              
              <div className="flex-1 overflow-y-auto">
                  {filteredUsers.length > 0 ? filteredUsers.map(u => {
                      const lastMsg = getLastMessage(u.id);
                      const unread = getUnreadCount(u.id);
                      return (
                          <div 
                            key={u.id} 
                            onClick={() => setActiveConversationId(u.id)}
                            className={`p-4 border-b border-gray-50 cursor-pointer transition hover:bg-gray-50 ${activeConversationId === u.id ? 'bg-blue-50 border-l-4 border-l-primary-600' : ''}`}
                          >
                              <div className="flex gap-3">
                                  <div className="relative">
                                      <img src={u.avatar} alt={u.name} className="w-12 h-12 rounded-full object-cover bg-gray-200" />
                                      {unread > 0 && (
                                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center font-bold border-2 border-white">
                                              {unread}
                                          </div>
                                      )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                      <div className="flex justify-between items-baseline mb-1">
                                          <h3 className={`text-sm truncate ${unread > 0 ? 'font-bold text-gray-900' : 'font-medium text-gray-700'}`}>{u.name}</h3>
                                          {lastMsg && <span className="text-xs text-gray-400 flex-shrink-0 ml-2">{formatTime(lastMsg.timestamp)}</span>}
                                      </div>
                                      <p className={`text-sm truncate ${unread > 0 ? 'font-semibold text-gray-800' : 'text-gray-500'}`}>
                                          {lastMsg ? (lastMsg.senderId === user.id ? `You: ${lastMsg.content}` : lastMsg.content) : t('startConversation')}
                                      </p>
                                  </div>
                              </div>
                          </div>
                      );
                  }) : (
                      <div className="p-8 text-center text-gray-400 text-sm">
                          {t('noNotifications')}
                      </div>
                  )}
              </div>
          </div>

          {/* Chat Area */}
          <div className={`flex-1 bg-white rounded-2xl shadow-sm border border-gray-200 flex-col h-full overflow-hidden ${activeUser ? 'flex' : 'hidden md:flex'}`}>
              {activeUser ? (
                  <>
                      {/* Header */}
                      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-white z-10 shadow-sm">
                          <div className="flex items-center gap-3">
                              {/* Mobile Back Button */}
                              <button onClick={() => setActiveConversationId(null)} className="md:hidden text-gray-500 hover:text-gray-900">
                                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                              </button>
                              
                              <img src={activeUser.avatar} alt={activeUser.name} className="w-10 h-10 rounded-full object-cover bg-gray-200" />
                              <div>
                                  <h3 className="font-bold text-gray-900">{activeUser.name}</h3>
                                  <p className="text-xs text-green-600 flex items-center gap-1">
                                      <span className="w-2 h-2 bg-green-500 rounded-full"></span> {t('online')}
                                  </p>
                              </div>
                          </div>
                          <button className="text-gray-400 hover:text-gray-600 p-2"><MoreVertical size={20}/></button>
                      </div>

                      {/* Messages List */}
                      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                          {currentMessages.length > 0 ? currentMessages.map(msg => {
                              const isMe = msg.senderId === user.id;
                              return (
                                  <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                      <div className={`max-w-[75%] md:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm relative group ${isMe ? 'bg-primary-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none'}`}>
                                          <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                                          <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-primary-100' : 'text-gray-400'}`}>
                                              {formatTime(msg.timestamp)}
                                              {isMe && (msg.isRead ? <div className="flex"><Check size={12}/><Check size={12} className="-ml-1"/></div> : <Check size={12}/>)}
                                          </div>
                                      </div>
                                  </div>
                              );
                          }) : (
                              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                                  <MessageSquare size={48} className="mb-4 opacity-20"/>
                                  <p>{t('startConversation')} with {activeUser.name}</p>
                              </div>
                          )}
                          <div ref={messagesEndRef} />
                      </div>

                      {/* Input */}
                      <form onSubmit={handleSend} className="p-4 border-t border-gray-100 bg-white">
                          <div className="flex gap-2">
                              <input 
                                type="text" 
                                value={messageInput}
                                onChange={(e) => setMessageInput(e.target.value)}
                                className="flex-1 border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-gray-50"
                                placeholder={t('typeMessage')}
                              />
                              <button 
                                type="submit" 
                                disabled={!messageInput.trim()}
                                className="bg-primary-600 text-white p-3 rounded-xl hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                              >
                                  <Send size={20} />
                              </button>
                          </div>
                      </form>
                  </>
              ) : (
                  <div className="flex flex-col items-center justify-center h-full text-gray-400">
                      <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                          <MessageSquare size={40} className="text-gray-300"/>
                      </div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{t('yourConversations')}</h3>
                      <p className="max-w-xs text-center text-sm">Select a user to chat.</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
