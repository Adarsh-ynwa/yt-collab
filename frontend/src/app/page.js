'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

export default function HomePage() {
  const [roomId, setRoomId] = useState('');
  const router = useRouter();

  const handleJoin = () => {
    if (roomId.trim()) {
      router.push(`/room/${roomId}`);
    }
  };

  const handleCreate = () => {
    const newRoomId = uuidv4().slice(0, 6); // short ID
    router.push(`/room/${newRoomId}`);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎬 Watch Together</h1>

      <div className="flex flex-col gap-3 max-w-sm w-full">
        <input
          type="text"
          className="border p-2 rounded"
          placeholder="Enter Room ID"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button
          onClick={handleJoin}
          className="bg-blue-600 text-white rounded px-4 py-2"
        >
          Join Room
        </button>
        <div className="text-center text-gray-500">or</div>
        <button
          onClick={handleCreate}
          className="bg-green-600 text-white rounded px-4 py-2"
        >
          Create New Room
        </button>
      </div>
    </main>
  );
}
