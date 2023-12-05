'use client'
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
        </div>
        <div>{children}</div>
    </div>
  );
};

export default SearchLayout;