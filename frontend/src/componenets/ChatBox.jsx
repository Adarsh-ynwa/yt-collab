'use client';
import React, { useEffect, useState } from 'react';
import socket from '@/utils/socket';

const ChatBox = ({ roomId }) => {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');

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
        sender: 'You',
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
    <div className="mt-4 border rounded p-3 max-w-md bg-white text-black">
      <h3 className="font-bold mb-2">💬 Chat</h3>
      <div className="h-40 overflow-y-auto border p-2 mb-2 bg-gray-100 rounded">
        {messages.map((m, i) => (
          <div key={i} className="text-sm mb-1">
            <strong>{m.sender}</strong>: {m.text}{' '}
            <span className="text-xs text-gray-500">({m.timestamp})</span>
          </div>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 border rounded p-1"
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type your message..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white px-3 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
