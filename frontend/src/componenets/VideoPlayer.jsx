'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import socket from '@/utils/socket';

const VideoPlayer = ({ roomId }) => {
  const playerRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const joinedRef = useRef(false); // 👈 Track join only once

  const getYoutubePlayer = () => {
    const internal = playerRef.current?.getInternalPlayer();
    return internal?.playVideo ? internal : playerRef.current?.getInternalPlayer('youtube');
  };

  useEffect(() => {
    if (!roomId) return;

    if (!joinedRef.current) {
      console.log('🎥 Emitting join-room', roomId);
      socket.emit('join-room', roomId);
      joinedRef.current = true;
    }

    // Clean any old listeners first
    socket.off('video-play');
    socket.off('video-pause');
    socket.off('video-seek');

    // Add listeners
    socket.on('video-play', () => {
      console.log('📩 Received: video-play');
      const yt = getYoutubePlayer();
      yt?.playVideo?.();
    });

    socket.on('video-pause', () => {
      console.log('📩 Received: video-pause');
      const yt = getYoutubePlayer();
      yt?.pauseVideo?.();
    });

    socket.on('video-seek', ({ time }) => {
      console.log('📩 Received: video-seek', time);
      playerRef.current?.seekTo(time, 'seconds');
    });

    return () => {
      console.log('🧹 Cleanup: Video Listeners');
      socket.off('video-play');
      socket.off('video-pause');
      socket.off('video-seek');
    };
  }, [roomId]);

  const handlePlay = () => {
    if (!roomId || !isReady) return;
    console.log('▶️ Emitting: play-video');
    socket.emit('play-video', { roomId });
  };

  const handlePause = () => {
    if (!roomId || !isReady) return;
    console.log('⏸️ Emitting: pause-video');
    socket.emit('pause-video', { roomId });
  };

  const handleSeek = () => {
    if (!roomId || !isReady) return;
    const time = playerRef.current.getCurrentTime();
    console.log('⏩ Emitting: seek-video', time);
    socket.emit('seek-video', { roomId, time });
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">🎬 Room ID: {roomId}</h2>
      <ReactPlayer
        ref={playerRef}
        url="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        controls
        playing={false}
        onPlay={handlePlay}
        onPause={handlePause}
        onSeek={handleSeek}
        onReady={() => {
          console.log('✅ YouTube Player is ready');
          setIsReady(true);
        }}
        config={{
          youtube: {
            playerVars: {
              enablejsapi: 1,
              origin: typeof window !== 'undefined' ? window.location.origin : undefined,
            },
          },
        }}
        width="100%"
        height="480px"
      />
    </div>
  );
};

export default VideoPlayer;
