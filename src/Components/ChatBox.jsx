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
    // For production (Vercel + Railway), always use WSS
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
  const ws = useRef(null);
  const chatEndRef = useRef(null);
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
      ws.current.send(
        JSON.stringify({ type: "register", user_id: user.userid })
      );
    };
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "message" && data.sender_id === receiver.userid) {
        setMessages((prev) => [
          ...prev,
          {
            sender_id: data.sender_id,
            receiver_id: user.userid,
            content: data.content,
            timestamp: data.timestamp || new Date().toISOString(),
          },
        ]);
      }
    };
    
    ws.current.onerror = (error) => {
      console.error("❌ WebSocket connection error:", error);
    };
    
    ws.current.onclose = (event) => {
      console.log("🔌 WebSocket connection closed:", event.code, event.reason);
    };
    
    return () => ws.current && ws.current.close();
  }, [user, receiver]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim() || !ws.current || ws.current.readyState !== 1 || !user || !user.userid || !receiver || !receiver.userid) return;
    ws.current.send(
      JSON.stringify({
        type: "message",
        sender_id: user.userid,
        receiver_id: receiver.userid,
        content: input,
      })
    );
    setMessages((prev) => [
      ...prev,
      {
        sender_id: user.userid,
        receiver_id: receiver.userid,
        content: input,
        timestamp: new Date().toISOString(), // Temporary timestamp until server confirms
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex flex-col h-[500px] w-full max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
      <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white py-3 px-4 font-bold text-lg">
        Chat với {receiver?.username || "..."}
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
