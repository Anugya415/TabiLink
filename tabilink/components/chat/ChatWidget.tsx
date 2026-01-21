"use client";

import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageCircle, X, Send, LifeBuoy } from 'lucide-react';
import { TicketForm } from './TicketForm';
import { cn } from '@/lib/utils'; // Assuming cn utility exists

interface Message {
    userId: string;
    message: string;
    timestamp: string;
    sender: 'user' | 'bot' | 'support';
}

const TypingIndicator = () => (
    <div className="flex gap-1 items-center p-2 bg-muted rounded-lg w-fit rounded-bl-none animate-in fade-in slide-in-from-bottom-2">
        <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1.5 h-1.5 bg-foreground/40 rounded-full animate-bounce"></div>
    </div>
);

export function ChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [mode, setMode] = useState<'chat' | 'ticket'>('chat');
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    // Store roomId to persist across re-renders
    const roomIdRef = useRef<string>("");

    useEffect(() => {
        if (!roomIdRef.current) {
            roomIdRef.current = 'user-room-' + Math.random().toString(36).substr(2, 9);
        }

        // Only connect when widget is open for the first time
        if (isOpen && !socketRef.current) {
            // Use environment variable for URL if available, else localhost
            socketRef.current = io('http://localhost:5000');

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                console.log('Connected to socket server');
                socketRef.current?.emit('join_room', roomIdRef.current);
            });

            socketRef.current.on('receive_message', (msg: Message) => {
                setMessages((prev) => [...prev, msg]);
            });

            socketRef.current.on('typing', (data: { userId: string, isTyping: boolean }) => {
                if (data.userId === 'floyd-bot') {
                    setIsTyping(data.isTyping);
                }
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
            });

            // Auto-welcome from Floyd
            setTimeout(() => {
                if (messages.length === 0) {
                    setMessages([{
                        userId: 'floyd',
                        message: "Hi! I'm Floyd. How can I help you today?",
                        timestamp: new Date().toISOString(),
                        sender: 'bot'
                    }]);
                }
            }, 500);
        }

        return () => {
            // socketRef.current?.disconnect(); // Optional: keep connected for navigation persistence?
        };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, mode]);

    const handleSendMessage = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (!inputValue.trim() || !socketRef.current) return;

        const msg: Message = {
            userId: 'user', // Replace with real user ID if available
            message: inputValue,
            timestamp: new Date().toISOString(),
            sender: 'user',
        };

        // Optimistic update? No, let's wait for echo or use optimistic implementation if latency is high.
        // My backend echoes to room. But usually we append immediately.
        // If backend echoes to sender, we might get duplicate if we append here.
        // Backend implementation: io.to(roomId).emit(...) which includes sender.
        // So we should NOT append here manually, OR we check logic.
        // Let's rely on backend echo for consistency.

        socketRef.current.emit('send_message', { ...msg, roomId: roomIdRef.current });
        // Wait, room ID logic in useEffect was random. This is a problem if we need to send to the same room.
        // I should store room ID in ref or state.

        setInputValue("");
    };

    // Fix Room ID Logic:
    // We need a persistent Room ID. For guest, maybe localStorage? For logged in, User ID.
    // For now, I'll hack it to use the socket ID or a partial fix.
    // I will update the emit slightly in a fix if needed, but let's assume the useEffect one persists in closure if I moved it out? No.
    // I need to store roomId.

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {!isOpen && (
                <Button
                    onClick={() => setIsOpen(true)}
                    className="rounded-full w-14 h-14 shadow-lg bg-primary hover:bg-primary/90 text-primary-foreground p-0"
                >
                    <MessageCircle className="w-8 h-8" />
                </Button>
            )}

            {isOpen && (
                <Card className="w-[350px] h-[500px] flex flex-col shadow-2xl overflow-hidden border-primary/20 animate-in fade-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="p-3 bg-primary text-primary-foreground flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                {mode === 'chat' ? <MessageCircle size={18} /> : <LifeBuoy size={18} />}
                            </div>
                            <div>
                                <h3 className="font-bold text-sm">TabiLink Support</h3>
                                <p className="text-xs opacity-80">{mode === 'chat' ? 'Chat with Floyd' : 'Create Ticket'}</p>
                            </div>
                        </div>
                        <div className="flex gap-1">
                            {mode === 'chat' && (
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/20" onClick={() => setMode('ticket')} title="Create Ticket">
                                    <LifeBuoy size={14} />
                                </Button>
                            )}
                            {mode === 'ticket' && (
                                <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/20" onClick={() => setMode('chat')} title="Back to Chat">
                                    <MessageCircle size={14} />
                                </Button>
                            )}
                            <Button variant="ghost" size="icon" className="h-6 w-6 hover:bg-white/20" onClick={() => setIsOpen(false)}>
                                <X size={14} />
                            </Button>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-hidden bg-background">
                        {mode === 'ticket' ? (
                            <TicketForm onCancel={() => setMode('chat')} />
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700">
                                    {messages.map((m, i) => (
                                        <div key={i} className={cn("flex w-full gap-2 items-end", m.sender === 'user' ? "justify-end" : "justify-start")}>
                                            {m.sender !== 'user' && (
                                                <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold shrink-0">
                                                    F
                                                </div>
                                            )}
                                            <div className={cn(
                                                "max-w-[80%] p-3 rounded-2xl text-sm shadow-sm",
                                                m.sender === 'user'
                                                    ? "bg-primary text-primary-foreground rounded-br-none"
                                                    : "bg-white dark:bg-slate-800 text-foreground rounded-bl-none border border-border"
                                            )}>
                                                <p className="whitespace-pre-wrap leading-relaxed">{m.message}</p>
                                                <span className={cn(
                                                    "text-[10px] block mt-1 text-right",
                                                    m.sender === 'user' ? "text-primary-foreground/70" : "text-muted-foreground"
                                                )}>
                                                    {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                    {isTyping && (
                                        <div className="flex w-full gap-2 items-end justify-start">
                                            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs text-primary-foreground font-bold shrink-0">
                                                F
                                            </div>
                                            <TypingIndicator />
                                        </div>
                                    )}
                                    <div ref={messagesEndRef} />
                                </div>

                                <form onSubmit={handleSendMessage} className="p-3 border-t bg-background flex gap-2">
                                    <Input
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        placeholder="Type a message..."
                                        className="flex-1"
                                    />
                                    <Button type="submit" size="icon" disabled={!isConnected || !inputValue.trim()}>
                                        <Send size={18} />
                                    </Button>
                                </form>
                            </div>
                        )}
                    </div>
                </Card>
            )}
        </div>
    );
}
