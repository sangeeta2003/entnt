import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

const MeetingRoom = () => {
  const { id } = useParams();
  const videoRef = useRef();
  const remoteVideoRef = useRef();

  useEffect(() => {
    // Initialize WebRTC connection
    const initializeMedia = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: true, 
          audio: true 
        });
        videoRef.current.srcObject = stream;
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    initializeMedia();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-4 h-full">
          {/* Local Video */}
          <div className="relative">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-center space-x-4">
              <button className="p-3 bg-red-600 rounded-full hover:bg-red-700">
                {/* End Call Icon */}
              </button>
              <button className="p-3 bg-gray-600 rounded-full hover:bg-gray-700">
                {/* Mute Icon */}
              </button>
              <button className="p-3 bg-gray-600 rounded-full hover:bg-gray-700">
                {/* Video Icon */}
              </button>
            </div>
          </div>

          {/* Remote Video */}
          <div className="relative">
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingRoom; 