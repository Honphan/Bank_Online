import { Client } from '@stomp/stompjs';

class WebSocketNative {
  constructor() {
    this.stompClient = null;
    this.connected = false;
  }

  connect(onMessageReceived, onConnected, onError, USER_ID) {
    console.log('🔄 Connecting to native WebSocket...');
    
    this.stompClient = new Client({
      // Không dùng SockJS, dùng WebSocket thuần
      brokerURL: `${import.meta.env.VITE_BROKER_URL}`,
      
      debug: (str) => {
        console.log('STOMP: ' + USER_ID + ' - ' + str);
      },
      
      reconnectDelay: 5000,
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      
      onConnect: (frame) => {
        console.log('✅✅✅ Connected successfully!', frame);
        this.connected = true;

        this.stompClient.subscribe(`/topic/messages/${USER_ID}`, (message) => {
          console.log('📩 User nhận tin từ Admin:', message.body);
          if (message.body) {
            const chatMessage = JSON.parse(message.body);
            onMessageReceived(chatMessage);
          }
        });
        
    
        
        if (onConnected) {
          onConnected();
        }
      },
      
      onStompError: (frame) => {
        console.error('❌ STOMP Error:', frame);
        this.connected = false;
        if (onError) {
          onError(frame);
        }
      },
      
      onWebSocketError: (event) => {
        console.error('❌ WebSocket Error:', event);
        this.connected = false;
        if (onError) {
          onError(event);
        }
      },
      
      onWebSocketClose: (event) => {
        console.log('🔌 WebSocket Closed',event);
        this.connected = false;
      }
    });

    this.stompClient.activate();
  }

  sendMessage(chatMessage) {
    if (this.stompClient && this.connected) {
      console.log('📤 Sending:', chatMessage);
      this.stompClient.publish({
        destination: '/app/chat.user',
        body: JSON.stringify(chatMessage)
      });
    } else {
      console.error('❌ Not connected!');
    }
  }

  disconnect() {
    if (this.stompClient) {
      this.stompClient.deactivate();
      this.connected = false;
    }
  }

  isConnected() {
    return this.connected;
  }
}

export default new WebSocketNative();