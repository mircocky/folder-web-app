// components/TasksList.tsx
'use client'
import { useState } from 'react';

const TasksList: React.FC = () => {
  const [newJobId, setNewJobId] = useState('');

  const handleCreateJob = async () => {
    try {
      const response = await fetch('/api/transportBookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_id: newJobId,
          // Include other properties if needed
        }),
      });

      if (response.ok) {
        // If the job is created successfully, you might want to provide some UI feedback
        console.log('Job created successfully');
        
        // Optionally, you can trigger a refetch of the job list or update the UI in some way
        // For example, you could call a function that fetches and updates the job list
        // fetchData();
      } else {
        console.error('Error creating job:', response.statusText);
      }
    } catch (error) {
      console.error('Error creating job:', error);
    }
  };

  return (
    <div>
      <div>
        <h3>Create New Job</h3>
        <input
          type="text"
          placeholder="Job ID"
          value={newJobId}
          onChange={(e) => setNewJobId(e.target.value)}
        />
        <button onClick={handleCreateJob}>Create Job</button>
      </div>
    </div>
  );
};

export default TasksList;
