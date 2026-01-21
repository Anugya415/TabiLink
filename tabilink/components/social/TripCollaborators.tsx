"use client"

import { useState } from "react"
import { Users, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import api from "@/lib/api"
import { toast } from "sonner"

interface Collaborator {
    id: number
    name: string
    email: string
    avatar?: string
}

interface TripCollaboratorsProps {
    tripId: number
    collaborators: Collaborator[]
    onUpdate?: () => void
}

export function TripCollaborators({ tripId, collaborators, onUpdate }: TripCollaboratorsProps) {
    const [email, setEmail] = useState("")
    const [isOpen, setIsOpen] = useState(false)

    const handleInvite = async () => {
        if (!email) return

        try {
            await api.inviteCollaborator(tripId, email)
            toast.success("Invitation sent!")
            setEmail("")
            setIsOpen(false)
            onUpdate?.()
        } catch (error: any) {
            toast.error(error.message || "Failed to invite user")
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h4 className="font-semibold flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Collaborators
                </h4>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            <UserPlus className="h-4 w-4 mr-2" />
                            Invite
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Invite to Trip</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <p className="text-sm text-muted-foreground">Enter the email address of the user you want to invite.</p>
                            <div className="flex gap-2">
                                <Input
                                    placeholder="email@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <Button onClick={handleInvite}>Send</Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="flex -space-x-2 overflow-hidden">
                {collaborators.map((user) => (
                    <Avatar key={user.id} className="inline-block border-2 border-background ring-2 ring-background">
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                ))}
                {collaborators.length === 0 && (
                    <p className="text-sm text-muted-foreground italic">No collaborators yet.</p>
                )}
            </div>
        </div>
    )
}
