import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';

const AdminChat = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const messagesEndRef = useRef(null);
  const stompClientRef = useRef(null);
  
  const ADMIN_ID = 'b887e322-9eed-4f0f-b703-1288221e024e';

  useEffect(() => {
    loadConversations();
    connectWebSocket();
    
    return () => {
      if (stompClientRef.current) {
        stompClientRef.current.deactivate();
      }
    };
  }, []);

  useEffect(() => {
    if (selectedUser) {
        console.log('Selected user:', selectedUser);
      loadChatHistory(selectedUser.userId);
    }
  }, [selectedUser]);

  useEffect(() => {
    if (selectedUser) {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, 0); // Ensure DOM updates before scrolling
    }
  }, [selectedUser, messages]);

  const loadConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `http://localhost:8081/api/admin/chat/conversations?adminId=${ADMIN_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        console.log('Loaded conversations:', data);
        const formattedConversations = data.map(conv => ({
          userId: conv.userId,
          lastMessage: conv.message,
          timestamp: conv.timestamp,
          unread: !conv.isRead && conv.receiverId === ADMIN_ID
        }));
        setConversations(formattedConversations);
      }
    } catch (error) {
      console.error('Error loading conversations:', error);
    }
  };

  const loadChatHistory = async (userId) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      console.log('Loading chat history for userId:', userId);
      const response = await fetch(
        `http://localhost:8081/api/chat/history?userId=${userId}&adminId=${ADMIN_ID}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (response.ok) {
        const history = await response.json();
        console.log('Raw chat history:', history);
        const formattedMessages = history.map(msg => ({
          message: msg.message,
          sender: msg.senderRole === 'ROLE_ADMIN' ? msg.adminId : msg.userId,
          senderName: msg.senderRole === 'ROLE_ADMIN' ? 'Admin' : 'User',
          timestamp: msg.timestamp,
          role: msg.senderRole
        }));
        console.log('Formatted chat history:', formattedMessages);
        setMessages(formattedMessages);
        
        await markAsRead(userId);
      }
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(
        `http://localhost:8081/api/chat/mark-read?userId=${userId}&adminId=${ADMIN_ID}`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      setConversations(prev => 
        prev.map(conv => 
          conv.userId === userId ? { ...conv, unread: false } : conv
        )
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const connectWebSocket = () => {
    const client = new Client({
      brokerURL: 'ws://localhost:8081/ws',
      debug: (str) => console.log('STOMP:', str),
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,

      onConnect: () => {
        console.log('✅ Admin WebSocket Connected');
        setIsConnected(true);

        client.subscribe(`/topic/admin/${ADMIN_ID}`, (message) => {
          console.log('📩 : Admin received message from user: ', message.body);
          if (message.body) {
            const chatMessage = JSON.parse(message.body);
            console.log('📩 : Admin received message:', chatMessage);

            setConversations((prev) => {
              const existingConversation = prev.find(
                (conv) => conv.userId === chatMessage.userId
              );

              console.log('Existing conversation:', existingConversation);

              if (existingConversation) {
                // Update the existing conversation to mark it as unread
                return prev.map((conv) =>
                  conv.userId === chatMessage.userId
                    ? {
                        ...conv,
                        lastMessage: chatMessage.message,
                        timestamp: new Date(),
                        unread: true,
                      }
                    : conv
                );
              } else {
                // Add a new conversation if it doesn't exist
                return [
                  ...prev,
                  {
                    userId: chatMessage.sender,
                    lastMessage: chatMessage.message,
                    timestamp: new Date(),
                    unread: true,
                  },
                ];
              }
            });

            if (selectedUser && chatMessage.sender === selectedUser.userId) {
              setMessages((prev) => [...prev, chatMessage]);
              markAsRead(chatMessage.sender);
            }
          }
        });
      },
      
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
        setIsConnected(false);
      },
      
      onWebSocketClose: () => {
        console.log('🔌 WebSocket Closed');
        setIsConnected(false);
      }
    });

    client.activate();
    stompClientRef.current = client;
  };

  const handleSendMessage = (e) => {
    e?.preventDefault();
    
    if (messageInput.trim() && isConnected && stompClientRef.current && selectedUser) {
      const chatMessage = {
        message: messageInput,
        adminId: ADMIN_ID,
        userId: selectedUser.userId,
        role: 'ROLE_ADMIN',
        timestamp: Date.now()
      };

      console.log('📤 Admin gửi tin nhắn:', chatMessage);
  

      stompClientRef.current.publish({
        destination: '/app/chat.admin',
        body: JSON.stringify(chatMessage)
      });

      console.log('📤 Admin gửi tin nhắn:', chatMessage);

      setMessages(prev => [...prev, {
        ...chatMessage,
        senderName: 'Admin'
      }]);
      
      setMessageInput('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    if (diff < 60000) return 'Vừa xong';
    if (diff < 3600000) return `${Math.floor(diff / 60000)} phút trước`;
    if (diff < 86400000) return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString('vi-VN');
  };

  useEffect(() => {
    if (selectedUser) {
      const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      };

      // Wait for messages to load before scrolling
      setTimeout(scrollToBottom, 100);
    }
  }, [selectedUser, messages]);

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h3 style={styles.sidebarTitle}>Cuộc trò chuyện</h3>
          <span style={{
            ...styles.connectionStatus,
            color: isConnected ? '#4CAF50' : '#f44336'
          }}>
            ● {isConnected ? 'Đang kết nối' : 'Mất kết nối'}
          </span>
        </div>
        
        <div style={styles.conversationList}>
          {conversations.length === 0 ? (
            <div style={styles.emptyConversations}>
              Chưa có cuộc trò chuyện nào
            </div>
          ) : (
            conversations.map((conv, index) => (
              <div
                key={index}
                onClick={() => setSelectedUser(conv)}
                style={{
                  ...styles.conversationItem,
                  backgroundColor: selectedUser?.userId === conv.userId ? '#e3f2fd' : 'white',
                  borderLeft: conv.unread ? '4px solid #4CAF50' : 'none'
                }}
              >
                <div style={styles.conversationHeader}>
                  <div style={styles.conversationUser}>
                    <div style={styles.avatar}>
                    </div>
                  </div>
                  {conv.unread && <span style={styles.unreadBadge}>●</span>}
                </div>
                <div style={styles.lastMessage}>
                  {conv.lastMessage?.substring(0, 50)}
                  {conv.lastMessage?.length > 50 ? '...' : ''}
                </div>
                <div style={styles.timestamp}>
                  {formatTimestamp(conv.timestamp)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={styles.chatArea}>
        {selectedUser ? (
          <>
            <div style={styles.chatHeader}>
              <div style={styles.chatHeaderInfo}>
                <div style={styles.avatarLarge}>
                </div>
                <div>
                  <span style={styles.chatHeaderSubtitle}>User</span>
                </div>
              </div>
            </div>

            <div className="messages-container" style={styles.messagesContainer}>
              {isLoading ? (
                <div style={styles.loading}>Đang tải lịch sử...</div>
              ) : messages.length === 0 ? (
                <div style={styles.emptyMessages}>
                  Chưa có tin nhắn nào
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    style={{
                      ...styles.messageWrapper,
                      justifyContent: msg.role === 'ROLE_ADMIN' ? 'flex-end' : 'flex-start'
                    }}
                  >
                    <div
                      style={{
                        ...styles.message,
                        backgroundColor: msg.role === 'ROLE_ADMIN' ? '#DCF8C6' : '#FFF',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div style={styles.messageSender}>
                        {msg.senderName}
                      </div>
                      <div style={styles.messageText}>
                        {msg.message}
                      </div>
                      <div style={styles.messageTime}>
                        {formatTimestamp(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <div style={styles.inputContainer}>
              <input
                type="text"
                placeholder="Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                style={styles.messageInput}
                disabled={!isConnected}
              />
              <button
                onClick={handleSendMessage}
                style={{
                  ...styles.sendButton,
                  opacity: isConnected ? 1 : 0.5
                }}
                disabled={!isConnected}
              >
                Gửi
              </button>
            </div>
          </>
        ) : (
          <div style={styles.noSelection}>
            <div style={styles.noSelectionIcon}>💬</div>
            <h3>Chọn một cuộc trò chuyện</h3>
            <p>Chọn người dùng từ danh sách bên trái để bắt đầu chat</p>
          </div>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    height: '600px',
    backgroundColor: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    overflow: 'hidden'
  },
  sidebar: {
    width: '300px',
    borderRight: '1px solid #e0e0e0',
    display: 'flex',
    flexDirection: 'column'
  },
  sidebarHeader: {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5'
  },
  sidebarTitle: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  connectionStatus: {
    fontSize: '12px',
    fontWeight: 'bold'
  },
  conversationList: {
    flex: 1,
    overflowY: 'auto'
  },
  emptyConversations: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#999'
  },
  conversationItem: {
    padding: '15px',
    borderBottom: '1px solid #f0f0f0',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  },
  conversationHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px'
  },
  conversationUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px'
  },
  avatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  userId: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: '#333'
  },
  unreadBadge: {
    color: '#4CAF50',
    fontSize: '20px'
  },
  lastMessage: {
    fontSize: '13px',
    color: '#666',
    marginBottom: '5px'
  },
  timestamp: {
    fontSize: '11px',
    color: '#999'
  },
  chatArea: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  },
  chatHeader: {
    padding: '15px',
    borderBottom: '1px solid #e0e0e0',
    backgroundColor: '#f5f5f5'
  },
  chatHeaderInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px'
  },
  avatarLarge: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    backgroundColor: '#4CAF50',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold'
  },
  chatHeaderTitle: {
    margin: '0 0 5px 0',
    fontSize: '16px',
    fontWeight: 'bold'
  },
  chatHeaderSubtitle: {
    fontSize: '12px',
    color: '#666'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '15px',
    backgroundColor: '#f5f5f5'
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#999'
  },
  emptyMessages: {
    textAlign: 'center',
    padding: '40px 20px',
    color: '#999'
  },
  messageWrapper: {
    display: 'flex',
    marginBottom: '10px'
  },
  message: {
    maxWidth: '70%',
    padding: '10px 12px',
    borderRadius: '10px',
    wordWrap: 'break-word'
  },
  messageSender: {
    fontSize: '11px',
    fontWeight: 'bold',
    color: '#666',
    marginBottom: '4px'
  },
  messageText: {
    fontSize: '14px',
    color: '#333'
  },
  messageTime: {
    fontSize: '10px',
    color: '#999',
    marginTop: '4px',
    textAlign: 'right'
  },
  inputContainer: {
    padding: '15px',
    borderTop: '1px solid #e0e0e0',
    display: 'flex',
    gap: '10px',
    backgroundColor: 'white'
  },
  messageInput: {
    flex: 1,
    padding: '10px',
    fontSize: '14px',
    border: '1px solid #ddd',
    borderRadius: '20px',
    outline: 'none'
  },
  sendButton: {
    padding: '10px 20px',
    fontSize: '14px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '20px',
    cursor: 'pointer'
  },
  noSelection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#999'
  },
  noSelectionIcon: {
    fontSize: '64px',
    marginBottom: '20px'
  }
};

export default AdminChat;