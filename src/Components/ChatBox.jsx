import React, { useEffect, useRef, useState } from "react";
import { http } from "../apis/config";
import { useSelector } from "react-redux";

// Determine WebSocket URL based on environment
const getWebSocketUrl = () => {
  const isDevelopment = import.meta.env.DEV;
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://backendchatwithme-production.up.railway.app";
  
  if (isDevelopment) {
    // For development, use WS
    return "ws://localhost:3000";
  } else {
    // For production (Vercel + Railway), use WSS with the same domain as API
    return apiBaseUrl.replace(/^https?:\/\//, 'wss://');
  }
};

const WS_URL = getWebSocketUrl();

export default function ChatBox({ receiver }) {
  let user = useSelector((state) => state.userSlice.user);
  if (!user) {
    user =
      JSON.parse(localStorage.getItem("user")) ||
      JSON.parse(localStorage.getItem("USER"));
  }

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [wsConnected, setWsConnected] = useState(false);
  const ws = useRef(null);
  const chatEndRef = useRef(null);
  const reconnectTimeout = useRef(null);
  useEffect(() => {
    if (user && receiver) {
      http
        .get(`/auth/messages?userId1=${user.userid}&userId2=${receiver.userid}`)
        .then((res) => setMessages(res.data))
        .catch(() => setMessages([]));
    }
  }, [user, receiver]);

  useEffect(() => {
    if (!user) return;
    console.log("WebSocket register user:", user);
    console.log("Connecting to WebSocket:", WS_URL);
    
    ws.current = new window.WebSocket(WS_URL);
    
    ws.current.onopen = () => {
      console.log("✅ WebSocket connected successfully");
      setWsConnected(true);
      ws.current.send(
        JSON.stringify({ type: "register", user_id: user.userid })
      );
    };
    
    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📨 Received WebSocket message:", data);
        
        if (data.type === "message") {
          // Check if this is a message for current chat
          const isForCurrentChat = 
            (data.sender_id === user.userid && data.receiver_id === receiver?.userid) ||
            (data.sender_id === receiver?.userid && data.receiver_id === user.userid);
          
          if (isForCurrentChat) {
            console.log("✅ Adding message to current chat");
            setMessages((prev) => {
              // Remove any temporary messages with same content
              const filteredPrev = prev.filter(msg => !(msg.temp && msg.content === data.content));
              
              return [
                ...filteredPrev,
                {
                  sender_id: data.sender_id,
                  receiver_id: data.receiver_id || user.userid,
                  content: data.content,
                  timestamp: data.timestamp || new Date().toISOString(),
                },
              ];
            });
          } else {
            console.log("⚠️ Message not for current chat, ignoring");
          }
        }
      } catch (error) {
        console.error("❌ Error parsing WebSocket message:", error);
      }
    };
    
    ws.current.onerror = (error) => {
      console.error("❌ WebSocket connection error:", error);
    };
    
    ws.current.onclose = (event) => {
      console.log("🔌 WebSocket connection closed:", event.code, event.reason);
      setWsConnected(false);
      
      // Try to reconnect after 3 seconds
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      reconnectTimeout.current = setTimeout(() => {
        console.log("🔄 Attempting to reconnect WebSocket...");
        // The useEffect will handle reconnection
      }, 3000);
    };
    
    return () => {
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
      if (ws.current) {
        ws.current.close();
        ws.current = null;
      }
      setWsConnected(false);
    };
  }, [user]); // Remove receiver dependency to prevent reconnection

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !user || !user.userid || !receiver || !receiver.userid) return;
    
    // Check WebSocket connection
    if (!ws.current || ws.current.readyState !== 1) {
      console.error("❌ WebSocket not connected, cannot send message");
      alert("Không thể kết nối. Vui lòng thử lại.");
      return;
    }
    
    const messageData = {
      type: "message",
      sender_id: user.userid,
      receiver_id: receiver.userid,
      content: input,
    };
    
    console.log("📤 Sending message:", messageData);
    
    // Add message immediately for better UX
    const tempMessage = {
      sender_id: user.userid,
      receiver_id: receiver.userid,
      content: input,
      timestamp: new Date().toISOString(),
      temp: true, // Mark as temporary
    };
    
    setMessages((prev) => [...prev, tempMessage]);
    
    try {
      ws.current.send(JSON.stringify(messageData));
      console.log("✅ Message sent via WebSocket");
    } catch (error) {
      console.error("❌ Failed to send message via WebSocket:", error);
      // Remove temp message if failed
      setMessages((prev) => prev.filter(msg => msg !== tempMessage));
    }
    
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 font-bold text-lg flex justify-between items-center">
        <span>Chat với {receiver?.username || "..."}</span>
        <div className={`w-3 h-3 rounded-full ${wsConnected ? 'bg-green-400' : 'bg-red-400'}`} title={wsConnected ? 'Connected' : 'Disconnected'}></div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender_id === user?.userid ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-2xl max-w-[70%] text-sm shadow
                ${
                  msg.sender_id === user?.userid
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }
              `}
            >
              {msg.content}
              <div className="text-[10px] text-right mt-1 opacity-60">
                {new Date(msg.timestamp).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <form
        onSubmit={sendMessage}
        className="flex items-center p-3 border-t bg-white"
      >
        <input
          className="flex-1 rounded-full border px-4 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Nhập tin nhắn..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full font-semibold transition"
        >
          Gửi
        </button>
      </form>
    </div>
  );
}
