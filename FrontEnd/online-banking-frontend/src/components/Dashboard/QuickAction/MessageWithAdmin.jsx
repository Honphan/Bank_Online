import React, { useState, useEffect, useRef } from 'react';
import WebSocketNative from '../../../api/WebSocketNative';
import './MessageWithAdmin.css'; // Import CSS for styling

const ChatComponent = () => {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [username, setUsername] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);
  const adminId = 'b887e322-9eed-4f0f-b703-1288221e024e'; // ID của admin hoặc người nhận cụ thể
  const userId = '302671fe-f7c3-4576-bba2-d442edc3c7c2'; // ID của người gửi là username hiện tại

  useEffect(() => {
    setUsername('hon6'); // Set the username once when the component mounts

    // Load message history from the server
    const fetchMessageHistory = async () => {
      console.log('Attempting to fetch message history...');
      try {
        const token = localStorage.getItem('token');
         const response = await fetch(
        `http://localhost:8081/api/chat/history?userId=${userId}&adminId=${adminId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
        console.log('Fetched message history:', response);
        const data = await response.json();
        console.log('Parsed message history:', data);
        setMessages(data);
      } catch (error) {
        console.error('Error fetching message history:', error);
      }
    };

    fetchMessageHistory();

    console.log('Attempting to connect WebSocket...');
    // Kết nối WebSocket
    WebSocketNative.connect(
      // Callback khi nhận được tin nhắn
      (message) => {
        setMessages((prev) => [...prev, message]);
      },
      // Callback khi kết nối thành công
      () => {
        setIsConnected(true);
        console.log('WebSocket connected successfully!');
      },
      // Callback khi có lỗi
      (error) => {
        setIsConnected(false);
        console.error('WebSocket error:', error);
      },
      userId
    );

    // Cleanup khi component unmount
    return () => {
      WebSocketNative.disconnect();
    };
  }, []);

  // Auto scroll xuống tin nhắn mới nhất
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (messageInput.trim() && isConnected) {
      const chatMessage = {
        message: messageInput,
        userId: userId,
        adminId: adminId,
        senderName: username,
        role: 'ROLE_USER',
        senderRole: 'ROLE_USER',
        times: new Date().toLocaleTimeString(),
        timestamp: Date.now()
      };
      console.log('Sending message:', chatMessage);

      try {      
        setMessages((prev) => [...prev, chatMessage]);
        // Send the message via WebSocket
        WebSocketNative.sendMessage(chatMessage);

       
        setMessageInput('');
      } catch (error) {
        console.error('Error sending message:', error);
      }
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

  // Màn hình chat
  return (
    <div className="chat-container">
      <div className="chat-box">
        <div className="chat-header">
          <h3>Chat Room</h3>
          <span
            className={`chat-status ${isConnected ? 'connected' : 'disconnected'}`}
          >
            {isConnected ? '● Đã kết nối' : '● Mất kết nối'}
          </span>
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.senderRole === 'ROLE_USER' ? 'user-message' : 'admin-message'}`}
            >
              <div className="message-text">{msg.message}</div>
              <div className="message-time">{formatTimestamp(msg.timestamp)}</div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSendMessage} className="input-container">
          <input
            type="text"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="input"
          />
          <button type="submit" className="send-button">
            Gửi
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatComponent;