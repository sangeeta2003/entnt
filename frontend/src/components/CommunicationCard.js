const CommunicationCard = ({ communication }) => {
  // Convert participants to array if it's a string
  const participantsList = Array.isArray(communication.participants) 
    ? communication.participants 
    : communication.participants?.split(',').map(p => p.trim()) || [];

  return (
    // ... other JSX remains the same

    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
      <UserGroupIcon className="h-4 w-4 mr-1" />
      {participantsList.join(', ')}
    </div>

    // ... rest of the JSX remains the same
  );
}; 