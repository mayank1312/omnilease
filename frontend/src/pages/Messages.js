import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import API from '../api';
import { Send, ArrowLeft, Package, MessageCircle } from 'lucide-react';
import io from 'socket.io-client';
import styles from './Messages.module.css';

const ENDPOINT = "http://localhost:5001"; 

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  
  const location = useLocation();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  const isCreatingChat = useRef(false);
  const socket = useRef(null);

  const userString = localStorage.getItem('userInfo');
  const currentUser = useMemo(() => userString ? JSON.parse(userString) : null, [userString]);

  const fetchConversations = useCallback(async () => {
    if (!currentUser) return;
    try {
      const { data } = await API.get('/chats', {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setConversations(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }, [currentUser]);

  const fetchMessages = useCallback(async (chatId) => {
    if (!currentUser) return;
    try {
      const { data } = await API.get(`/chats/${chatId}/messages`, {
        headers: { Authorization: `Bearer ${currentUser.token}` }
      });
      setMessages(data);
      
      if (socket.current) {
        socket.current.emit("join chat", chatId);
      }
    } catch (error) {
      console.error(error);
    }
  }, [currentUser]);

  const initiateChatFromProduct = useCallback(async (productId) => {
    if (!currentUser || isCreatingChat.current) return; 
    isCreatingChat.current = true; 

    try {
      const listingRes = await API.get(`/listings/${productId}`);
      const listing = listingRes.data;
      const ownerId = listing.owner?._id || listing.owner;

      if (!ownerId || ownerId === currentUser._id) {
          navigate('/messages', { replace: true });
          return;
      }

      const { data } = await API.post('/chats', 
        { ownerId: ownerId, listingId: productId },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );

      setActiveChat(data);
      setNewMessage(`Hey! I want to enquire about your ${listing.title}. Is it available?`);
      fetchConversations();
      navigate('/messages', { replace: true });

    } catch (error) {
      console.error(error);
    } finally {
      isCreatingChat.current = false; 
    }
  }, [currentUser, navigate, fetchConversations]);

  useEffect(() => {
    if (currentUser) {
      socket.current = io(ENDPOINT);
      socket.current.emit("setup", currentUser);
    }
    return () => {
      if (socket.current) socket.current.disconnect();
    };
  }, [currentUser]);

 useEffect(() => {
    if (!socket.current || !currentUser) return;

    const handleNewMessage = (newMessageReceived) => {
      if (newMessageReceived.sender._id === currentUser._id) return;

      if (activeChat && activeChat._id === newMessageReceived.conversationId) {
        setMessages((prev) => {
          if (prev.find(m => m._id === newMessageReceived._id)) return prev;
          return [...prev, newMessageReceived];
        });
      }
      
      fetchConversations();
    };

    socket.current.on("message received", handleNewMessage);
    
    return () => {
      socket.current.off("message received", handleNewMessage);
    };
  }, [activeChat?._id, fetchConversations, currentUser?._id]);

  useEffect(() => {
    if (!currentUser) {
      navigate('/auth');
      return;
    }
    fetchConversations();
  }, [navigate, currentUser, fetchConversations]);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const productId = queryParams.get('product');
    if (productId && currentUser) initiateChatFromProduct(productId);
  }, [location.search, currentUser, initiateChatFromProduct]);

  useEffect(() => {
    if (activeChat) fetchMessages(activeChat._id);
  }, [activeChat, fetchMessages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !currentUser) return;

    try {
      const { data } = await API.post('/chats/message', 
        { text: newMessage, conversationId: activeChat._id },
        { headers: { Authorization: `Bearer ${currentUser.token}` } }
      );
      
      const socketPayload = {
        ...data,
        conversationId: activeChat._id,
        chat: { users: activeChat.participants },
        sender: { _id: currentUser._id }
      };

      if (socket.current) socket.current.emit("new message", socketPayload);
      
      setNewMessage('');
      setMessages(prev => [...prev, data]);
      fetchConversations();
      
    } catch (error) {
      console.error(error);
    }
  };

  const getOtherUser = (participants) => {
    if (!participants) return { name: "User" };
    return participants.find(p => p._id !== currentUser._id) || { name: "User" };
  };

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [conversations]);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.inboxWrapper}>
        
        <div className={`${styles.sidebar} ${activeChat ? styles.hideOnMobile : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2>Messages</h2>
          </div>
          <div className={styles.chatList}>
            {sortedConversations.length === 0 ? (
              <p className={styles.emptyText}>No messages yet.</p>
            ) : (
              sortedConversations.map(chat => {
                const otherUser = getOtherUser(chat.participants);
                const isUnread = chat.latestMessage && 
                                !chat.latestMessage.isRead && 
                                chat.latestMessage.sender !== currentUser._id;

                return (
                  <div 
                    key={chat._id} 
                    className={`${styles.chatItem} ${activeChat?._id === chat._id ? styles.active : ''} ${isUnread ? styles.unread : ''}`}
                    onClick={() => setActiveChat(chat)}
                  >
                    <div className={styles.avatar}>{otherUser.name?.charAt(0)}</div>
                    <div className={styles.chatPreview}>
                      <div className={styles.chatHeaderRow}>
                        <p className={styles.chatName}>{otherUser.name}</p>
                        <span className={styles.chatTime}>
                          {chat.updatedAt ? new Date(chat.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </span>
                      </div>
                      <p className={styles.chatSubject}>{chat.listing?.title}</p>
                      <p className={styles.lastMessageText}>
                        {chat.latestMessage?.text || "New Enquiry"}
                      </p>
                    </div>
                    {isUnread && <div className={styles.unreadDot} />}
                  </div>
                )
              })
            )}
          </div>
        </div>

        <div className={`${styles.chatArea} ${!activeChat ? styles.hideOnMobile : ''}`}>
          {!activeChat ? (
            <div className={styles.noChatSelected}>
              <MessageCircle size={48} color="#ccc" />
              <h3>Select a chat</h3>
            </div>
          ) : (
            <>
              <div className={styles.chatHeader}>
                <button className={styles.backBtn} onClick={() => setActiveChat(null)}>
                  <ArrowLeft size={20} />
                </button>
                <div className={styles.headerInfo}>
                  <h3>{getOtherUser(activeChat.participants).name}</h3>
                  <div className={styles.listingContext}>
                    <Package size={14} />
                    <span>{activeChat.listing?.title}</span>
                  </div>
                </div>
              </div>

              <div className={styles.messageHistory}>
                {messages.map((msg) => (
                  <div key={msg._id} className={`${styles.messageWrapper} ${msg.sender._id === currentUser._id ? styles.myMessage : styles.theirMessage}`}>
                    <div className={styles.bubble}>{msg.text}</div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <form className={styles.inputArea} onSubmit={handleSendMessage}>
                <input 
                  type="text" 
                  placeholder="Type a message..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={!newMessage.trim()}><Send size={20} /></button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;