// pages/index.tsx
"use client"

import { Input } from "@/components/ui/input";
import { useState } from 'react';
import { Button } from '@/components/ui/button';

const Home: React.FC = () => {
  const [actionType, setActionType] = useState<string>('');
  const [completeDate, setCompleteDate] = useState<string>('');
  const [driverID, setDriverID] = useState<string>('');
  const [jobID, setJobID] = useState<string>('');

  const sendEmail = async () => {
    try {
      const response = await fetch('/api/sendingEmails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          job_id : jobID,
          action_type: actionType, 
          complete_date : completeDate, 
          driver_id : driverID
         }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div>
      <h1>Email Sender Form</h1>

      <form>
        <label htmlFor="actionType">Action Type:</label>
        <Input
          type="text"
          id="jobID"
          name="job_ID"
          value={jobID}
          onChange={(e) => setJobID(e.target.value)}
          required
        />
        <Input
          type="text"
          id="actionType"
          name="action_type"
          value={actionType}
          onChange={(e) => setActionType(e.target.value)}
          required
        />
        <Input
          type="text"
          id="completeDate"
          name="complete_date"
          value={completeDate}
          onChange={(e) => setCompleteDate(e.target.value)}
          required
        />
        <Input
          type="text"
          id="driverID"
          name="driver_ID"
          value={driverID}
          onChange={(e) => setDriverID(e.target.value)}
          required
        />
        <Button type="button" onClick={sendEmail}>
          Send Email
        </Button>
      </form>
    </div>
  );
};

export default Home;