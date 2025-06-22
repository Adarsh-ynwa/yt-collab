'use client';

import { useParams } from 'next/navigation';
import VideoPlayer from '../../../componenets/VideoPlayer';
import ChatBox from '../../../componenets/ChatBox';

export default function RoomPage() {
  const { roomId } = useParams();

  return (
    <main className="h-screen w-screen overflow-hidden bg-gradient-to-br from-slate-100 to-slate-300">
      {/* Layout wrapper */}
      <div className="flex h-full w-full max-w-screen-2xl mx-auto">
        {/* Left: Video Player */}
        <div className="flex-1 flex flex-col p-4">
          <h2 className="text-2xl text-gray-900 font-bold mb-2">🎬 Room ID: {roomId}</h2>
          <div className="flex-1 overflow-hidden rounded-xl shadow-md bg-white p-2">
            <VideoPlayer roomId={roomId} />
          </div>
        </div>

        {/* Right: Chat Box */}
        <div className="w-[28rem] bg-white p-4 shadow-md border-l border-gray-200 flex flex-col h-full">
          <h3 className="text-lg font-semibold mb-2 text-gray-700">💬 Live Chat</h3>
          <div className="flex-1 overflow-y-auto">
            <ChatBox roomId={roomId} />
          </div>
        </div>
      </div>
    </main>
  );
}
