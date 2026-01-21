"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "sonner"; // Assuming sonner is used as it was in package.json

export function TicketForm({ onCancel }: { onCancel: () => void }) {
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            // Assuming authorization header is handled by axios interceptor or cookie
            // If not, we might fail if not logged in. 
            // For now, let's assume global axios config or simple request.
            const token = localStorage.getItem('token'); // Simplistic token retrieval
            await axios.post('http://localhost:5000/api/v1/tickets',
                { subject, description, priority },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Ticket created successfully");
            onCancel();
        } catch (error) {
            console.error(error);
            toast.error("Failed to create ticket");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Subject</label>
                <Input
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="Brief description of issue"
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Detailed explanation..."
                />
            </div>
            <div className="space-y-2">
                <label className="text-sm font-medium">Priority</label>
                <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                </select>
            </div>
            <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" type="button" onClick={onCancel}>Cancel</Button>
                <Button type="submit" disabled={loading}>
                    {loading ? "Submitting..." : "Submit Ticket"}
                </Button>
            </div>
        </form>
    );
}
