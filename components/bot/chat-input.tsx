import React from "react";
import { Button } from "../ui/button";
import { Send } from "lucide-react";
import { Input } from "../ui/input";

const ChatInput = ({
  handleSubmit,
  handleInputChange,
  input,
  inputRef,
}: {
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  input: string;
  inputRef: React.RefObject<HTMLInputElement | null>;
}) => {
  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center space-x-2"
    >
      <Input
        ref={inputRef}
        placeholder="Type your message..."
        value={input}
        onChange={handleInputChange}
        className="flex-1"
      />
      <Button
        type="submit"
        size="icon"
        disabled={status === "streaming" || !input.trim()}
      >
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};

export default ChatInput;
