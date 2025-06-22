'use client';

import React, { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import socket from '@/utils/socket';

const VideoPlayer = ({ roomId }) => {
  const playerRef = useRef();
  const [isReady, setIsReady] = useState(false);
  const [videoUrl, setVideoUrl] = useState('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const joinedRef = useRef(false);

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

    socket.off('video-play');
    socket.off('video-pause');
    socket.off('video-seek');
    socket.off('change-video');

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

    socket.on('change-video', ({ url }) => {
      console.log('📩 Received: change-video', url);
      setVideoUrl(url);
    });

    return () => {
      console.log('🧹 Cleanup: Video Listeners');
      socket.off('video-play');
      socket.off('video-pause');
      socket.off('video-seek');
      socket.off('change-video');
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

  const handleUrlSubmit = (e) => {
    if (e.key === 'Enter') {
      const url = e.target.value.trim();
      if (ReactPlayer.canPlay(url)) {
        console.log('🎯 Emitting: change-video', url);
        setVideoUrl(url);
        socket.emit('change-video', { roomId, url });
        e.target.value = '';
      } else {
        alert('❌ Invalid YouTube URL');
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full p-4">
      <h2 className="text-xl text-gray-900 font-bold mb-4">🎬 Room ID: {roomId}</h2>

      <input
        type="text"
        placeholder="Paste YouTube URL and press Enter"
        className="mb-4 w-full p-2 text-gray-900 border rounded"
        onKeyDown={handleUrlSubmit}
      />

      <div className="flex-1 w-full h-full">
        <ReactPlayer
          key={videoUrl}
          ref={playerRef}
          url={videoUrl}
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
          height="100%"
          className="rounded overflow-hidden"
        />
      </div>
    </div>
  );
};

export default VideoPlayer;
