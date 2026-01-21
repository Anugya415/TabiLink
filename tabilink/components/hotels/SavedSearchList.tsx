"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Trash2, Search, Bell } from 'lucide-react'
import api from '@/lib/api'
import { toast } from 'sonner'
import { useTranslation } from "@/contexts/TranslationContext"

interface SavedSearch {
    id: number
    userId: number
    name: string
    criteria: string // JSON
    createdAt: string
}

interface SavedSearchListProps {
    onApply: (criteria: any) => void
}

export function SavedSearchList({ onApply }: SavedSearchListProps) {
    const [searches, setSearches] = useState<SavedSearch[]>([])
    const { t } = useTranslation()

    useEffect(() => {
        fetchSearches()
    }, [])

    const fetchSearches = async () => {
        try {
            const res: any = await api.getSavedSearches();
            if (res.success) {
                setSearches(res.data)
            }
        } catch (error) {
            console.error("Failed to load saved searches")
        }
    }

    const handleDelete = async (id: number) => {
        try {
            await api.deleteSavedSearch(id);
            setSearches(prev => prev.filter(s => s.id !== id))
            toast.success("Saved search deleted")
        } catch (error) {
            toast.error("Failed to delete search")
        }
    }

    if (searches.length === 0) return null

    return (
        <Card className="mt-8 border-dashed bg-muted/30">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    <Bell className="h-5 w-5 text-primary" />
                    {t("savedSearches") || "Saved Searches"}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searches.map(search => (
                        <div key={search.id} className="group flex items-center justify-between p-3 bg-card border rounded-lg hover:shadow-md transition-all">
                            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => onApply(JSON.parse(search.criteria))}>
                                <h4 className="font-medium truncate">{search.name}</h4>
                                <p className="text-xs text-muted-foreground truncate">
                                    {new Date(search.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(search.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
