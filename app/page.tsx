// Import necessary libraries/components
'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const HomePage: React.FC = () => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // Allow only numeric input
    const value = event.target.value.replace(/\D/g, '');
    setInputValue(value);
  };

  const handleSearch = () => {
    if (!inputValue) {
      // Show a message box or perform any action for an empty input
      alert('Please enter a job id.');
    } else {
      // Navigate or perform the desired action with the input value
      window.location.href = `/searchbyid/${inputValue}`;
    }
  };

  return (
    <div>
      <h1 className="mb-4">PNL Tracking System. Please enter your job id...</h1>
      <div className="flex justify-start w-96">
        <Input
          className="me-4"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <Button
          onClick={handleSearch}
        >
          Search
        </Button>
      </div>
    </div>
  );
};

export default HomePage;
