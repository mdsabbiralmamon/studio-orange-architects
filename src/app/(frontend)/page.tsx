"use client"
import Navbar from '@/components/frontend/shared/Navbar/Navbar';
import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import PageTitle from '@/components/PageTitle/PageTitle'

const Page = () => {
  const [showVideo, setShowVideo] = useState(true);
  const [showSecondVideo, setShowSecondVideo] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);

  const handleFirstVideoEnd = () => {
    setFadeOut(true);
    setTimeout(() => {
      setShowVideo(false);
      setShowSecondVideo(true);
    }, 1000);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => {
        setShowVideo(false);
        setShowSecondVideo(true);
      }, 1000);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <PageTitle title={`Studio Orange Architects (SOA)`} />
      {/* Full-screen video */}
      <div className="absolute top-0 left-0 w-full h-full">
        {showVideo && (
          <ReactPlayer
            url="/animation.mp4"
            playing={true}
            muted={true}
            loop={false}
            width="100%"
            height="100%"
            className="object-cover"
            controls={false}
            onEnded={handleFirstVideoEnd}
            onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => e.preventDefault()}
            style={{
              transition: 'opacity 1s ease-out',
              opacity: fadeOut ? 0 : 1,
            }}
          />
        )}
      </div>

      {/* Second video */}
      {showSecondVideo && (
        <div>
          {/* Navbar (always visible above both videos) */}
          <div className="absolute top-0 left-0 w-full z-10">
            <Navbar textClass="text-white" />
          </div>
          <video
            src="/home-video.mp4"
            autoPlay
            muted
            loop
            controls={false}
            controlsList="nodownload"
            className="h-screen w-full object-cover"
            onContextMenu={(e) => e.preventDefault()}
          />
        </div>
      )}
    </div>
  );
};

export default Page;
