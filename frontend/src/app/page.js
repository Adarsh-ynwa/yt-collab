"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

export default function HomePage() {
  const [name, setName] = useState("");
  const [roomId, setRoomId] = useState("");
  const router = useRouter();

  const handleJoin = () => {
    if (!name.trim()) {
      alert("Please enter your name before joining!");
      return;
    }

    if (roomId.trim()) {
      localStorage.setItem("username", name);
      router.push(`/room/${roomId}`);
    }
  };

  const handleCreate = () => {
    if (!name.trim()) {
      alert("Please enter your name before creating a room!");
      return;
    }

    const newRoomId = uuidv4().slice(0, 6);
    localStorage.setItem("username", name);
    router.push(`/room/${newRoomId}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-yellow-200 via-orange-100 to-white flex flex-col items-center justify-center">
      <div className="bg-white shadow-xl rounded-xl px-10 py-8 max-w-md w-full">
        <h1 className="text-2xl font-semibold text-center mb-6 text-black">
          🎬 Watch Together
        </h1>

        <div className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Your Name"
            className="bg-gray-100 text-gray-900 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="text"
            placeholder="Room Code (Optional)"
            className="bg-gray-100 text-gray-900 rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-400"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />

          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-full transition"
          >
            Create Room
          </button>

          <button
            onClick={handleJoin}
            className="bg-gray-200 hover:bg-gray-300 text-black font-medium py-2 rounded-full transition"
          >
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}
