'use client';
import React, { useEffect, useState } from 'react';
import socket from '@/utils/socket';

const ChatBox = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');

  // ✅ Fetch username from localStorage
  const username =
    typeof window !== 'undefined' ? localStorage.getItem('username') || 'Anonymous' : 'Anonymous';

  useEffect(() => {
    if (!roomId) return;

    socket.emit('join-room', roomId);
    console.log('💬 ChatBox joined room:', roomId);

    socket.on('receive-message', (message) => {
      console.log('📩 Message received:', message);
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off('receive-message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (msg.trim()) {
      const messageObj = {
        sender: username,
        text: msg,
      };

      socket.emit('send-message', {
        roomId,
        message: messageObj,
      });

      setMessages((prev) => [
        ...prev,
        {
          ...messageObj,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      setMsg('');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col h-[400px]">
      <h3 className="font-bold text-lg text-gray-900 mb-3">💬 Live Chat</h3>

      <div className="flex-1 overflow-y-auto space-y-2 px-1 pr-2 scrollbar-thin scrollbar-thumb-gray-300">
        {messages.map((m, i) => {
          const isCurrentUser = m.sender === username;
          const displayName = isCurrentUser ? 'You' : m.sender;

          return (
            <div key={i} className="text-sm bg-gray-100 p-2 rounded-md">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold text-blue-600">{displayName}</span>
                <span className="text-xs text-gray-500">{m.timestamp}</span>
              </div>
              <p className="text-gray-800">{m.text}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-3 flex gap-2">
        <input
          type="text"
          className="flex-1 border border-gray-300 text-gray-900 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Type your message..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
