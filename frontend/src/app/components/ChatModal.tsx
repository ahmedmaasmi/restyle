"use client";
import { useState } from 'react';
import { Send, X } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Message, Product, User } from '../types';

interface ChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  otherUser: User;
  messages: Message[];
  onSendMessage: (content: string) => void;
}

export function ChatModal({
  isOpen,
  onClose,
  product,
  otherUser,
  messages,
  onSendMessage,
}: ChatModalProps) {
  const [messageText, setMessageText] = useState('');

  const handleSend = () => {
    if (messageText.trim()) {
      onSendMessage(messageText);
      setMessageText('');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg h-[600px] flex flex-col p-0">
        <DialogHeader className="p-4 border-b">
          <div className="flex items-center gap-3">
            <img
              src={otherUser.avatar}
              alt={otherUser.name}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <DialogTitle>{otherUser.name}</DialogTitle>
              <p className="text-gray-600">Re: {product.title}</p>
            </div>
          </div>
        </DialogHeader>

        {/* Product Preview */}
        <div className="px-4 py-3 bg-gray-50 border-b flex items-center gap-3">
          <img
            src={product.images[0]}
            alt={product.title}
            className="w-12 h-12 object-cover rounded"
          />
          <div className="flex-1 min-w-0">
            <p className="text-gray-900 truncate">{product.title}</p>
            <p className="text-teal-600">${product.price.toFixed(2)}</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.senderId === otherUser.id
                    ? 'justify-start'
                    : 'justify-end'
                }`}
              >
                <div
                  className={`max-w-[70%] rounded-lg px-4 py-2 ${
                    message.senderId === otherUser.id
                      ? 'bg-gray-100 text-gray-900'
                      : 'bg-teal-600 text-white'
                  }`}
                >
                  <p>{message.content}</p>
                  <p
                    className={`mt-1 ${
                      message.senderId === otherUser.id
                        ? 'text-gray-500'
                        : 'text-teal-100'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Message Input */}
        <div className="p-4 border-t">
          <div className="flex gap-2">
            <Input
              placeholder="Type a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSend();
                }
              }}
            />
            <Button onClick={handleSend} disabled={!messageText.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
