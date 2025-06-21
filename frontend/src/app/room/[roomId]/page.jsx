'use client';

import { useParams } from 'next/navigation';
import VideoPlayer from '../../../componenets/VideoPlayer';
import ChatBox from '../../../componenets/ChatBox';

export default function RoomPage() {
  const { roomId } = useParams();

  return (
    <main className="p-6 flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">🔗 Room: {roomId}</h2>
      <VideoPlayer roomId={roomId} />
      <ChatBox roomId={roomId} />
      
    </main>
  );
}
