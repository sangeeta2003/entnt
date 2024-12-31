import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  VideoCameraIcon, 
  MicrophoneIcon, 
  ChatBubbleLeftIcon,
  ComputerDesktopIcon,
  XMarkIcon,
  HandRaisedIcon
} from '@heroicons/react/24/outline';
import Button from './Button';

const MeetingInterface = ({ meeting, onClose }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now(),
          text: newMessage,
          sender: 'You',
          time: new Date().toLocaleTimeString()
        }
      ]);
      setNewMessage('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="bg-gray-900 p-4 flex items-center justify-between">
          <div>
            <h2 className="text-white font-semibold">{meeting.subject}</h2>
            <p className="text-gray-400 text-sm">{meeting.company}</p>
          </div>
          <Button
            variant="secondary"
            icon={XMarkIcon}
            onClick={onClose}
          >
            End Meeting
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex">
          {/* Video Grid */}
          <div className="flex-1 p-4 grid grid-cols-2 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-800 rounded-lg aspect-video flex items-center justify-center"
            >
              {isVideoOff ? (
                <div className="text-gray-500 text-center">
                  <VideoCameraIcon className="h-12 w-12 mx-auto mb-2" />
                  <p>Video Off</p>
                </div>
              ) : (
                <video className="w-full h-full rounded-lg" autoPlay muted />
              )}
            </motion.div>
            {/* Add more participant video slots as needed */}
          </div>

          {/* Chat Sidebar */}
          <div className="w-80 bg-gray-900 p-4 flex flex-col">
            <div className="flex-1 overflow-y-auto space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className="bg-gray-800 rounded-lg p-3"
                >
                  <div className="flex justify-between text-sm">
                    <span className="text-white font-medium">
                      {message.sender}
                    </span>
                    <span className="text-gray-400">
                      {message.time}
                    </span>
                  </div>
                  <p className="text-gray-300 mt-1">
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
            <form onSubmit={handleSendMessage} className="mt-4">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-gray-900 p-4">
          <div className="flex justify-center space-x-4">
            <Button
              variant={isMuted ? 'danger' : 'secondary'}
              icon={MicrophoneIcon}
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? 'Unmute' : 'Mute'}
            </Button>
            <Button
              variant={isVideoOff ? 'danger' : 'secondary'}
              icon={VideoCameraIcon}
              onClick={() => setIsVideoOff(!isVideoOff)}
            >
              {isVideoOff ? 'Start Video' : 'Stop Video'}
            </Button>
            <Button
              variant={isScreenSharing ? 'danger' : 'secondary'}
              icon={ComputerDesktopIcon}
              onClick={() => setIsScreenSharing(!isScreenSharing)}
            >
              {isScreenSharing ? 'Stop Share' : 'Share Screen'}
            </Button>
            <Button
              variant={isHandRaised ? 'primary' : 'secondary'}
              icon={HandRaisedIcon}
              onClick={() => setIsHandRaised(!isHandRaised)}
            >
              {isHandRaised ? 'Lower Hand' : 'Raise Hand'}
            </Button>
            <Button
              variant="danger"
              onClick={onClose}
            >
              Leave Meeting
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MeetingInterface; 