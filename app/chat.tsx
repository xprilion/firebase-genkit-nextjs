"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { PaperPlaneIcon, PieChartIcon } from "@radix-ui/react-icons";
import UserChatBubble from "@/components/chat/user-chat";
import BotChatBubble from "@/components/chat/bot-chat";
import LoadingBar from "@/components/loading-bar";

interface ChatMessage {
  message: string;
  timestamp?: Date;
  from?: string;
}

export default function ChatUi() {
  const [modelId, setModelId] = useState("gemma:2b");
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const fetchModelIdFromLocalStorage = () => {
    const storedData = localStorage.getItem('modelId');
    if (storedData) {
      setModelId(storedData);
    }
  };

  useEffect(() => {
    fetchModelIdFromLocalStorage();
    setHistory([{ from: 'bot', message: "Hello! How can I help you today?" }]);
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      const lastMessage = history[history.length - 1];
      if (lastMessage.from === 'user' || lastMessage.from === 'bot') {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [history]);

  const handleSendMessage = async () => {
    fetchModelIdFromLocalStorage();

    if (message.trim() === '') return;

    setHistory([...history, { from: 'user', message: message }]);
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message, modelId }),
      });

      if (!response.body) {
        setHistory([...history, { from: 'user', message: message }, { from: 'bot', message: 'Sorry, I am not able to respond at the moment.' }]);
        setLoading(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      let botMessage = '';
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
		  const chars = decoder.decode(value)
          botMessage += chars;
          setHistory(prevHistory => {
            const newHistory = [...prevHistory];
            const lastMessage = newHistory[newHistory.length - 1];
            if (lastMessage && lastMessage.from === 'bot') {
              lastMessage.message = botMessage;
            } else {
              newHistory.push({ from: 'bot', message: botMessage });
            }
            return newHistory;
          });
		  bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
      }
    } catch (error) {
      setHistory([...history, { from: 'user', message: message }, { from: 'bot', message: 'Sorry, I am not able to respond at the moment.' }]);
    } finally {
      setLoading(false);
      setMessage('');
    }
  };

  const handleKeyPress = (e: { key: string }) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex-1 flex justify-center items-center">
      <Card className="w-full max-w-3xl h-[85vh] flex flex-col m-[1rem]">
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {history.map((msg, index) => {
            const borderColor = msg.from === 'user' ? 'dodgerblue' : msg.message.startsWith('Sorry') ? 'red' : '#43a047';
            const ChatBubbleComponent = msg.from === 'bot' ? BotChatBubble : UserChatBubble;

            return (
              <div key={`chat-${index}`}>
                <blockquote style={{ borderLeft: `4px solid ${borderColor}` }}>
                  <ChatBubbleComponent message={msg.message} />
                </blockquote>
              </div>
            );
          })}
			{loading && <LoadingBar />}
          <div ref={bottomRef}></div>
        </CardContent>
        <div className="bg-white dark:bg-gray-950 px-4 py-3 flex items-center gap-2 border-t dark:border-gray-800">
          <Textarea
            placeholder="Type your message..."
            className="flex-1 resize-none border-0 focus:ring-0 dark:bg-gray-950 dark:text-white"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button
            type="submit"
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={handleSendMessage}
          >
            {loading ? (
              <PieChartIcon className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <PaperPlaneIcon className="mr-2 h-4 w-4" />
            )}
            <span className="sr-only">Send</span>
          </Button>
        </div>
      </Card>
    </div>
  );
}
