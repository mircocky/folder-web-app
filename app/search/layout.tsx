'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import WebSocketComponent from '@/components/WebSocketComponent';


const SearchLayout = ({
  children,
}: {
  children: React.ReactNode
}) => {

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
    window.location.href = `/search/searchbyid/${inputValue}`;
}

};

const handleRefresh = () => {
  window.location.reload()
};

  return (
    <div>
        <div className="flex mt-12">
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
            <Button
                className="ms-2 bg-red-500"
                onClick={handleRefresh}
                >
                Reload
            </Button>
        </div>
        <div><WebSocketComponent /></div>
        <div>{children}</div>
    </div>
  );
};

export default SearchLayout;