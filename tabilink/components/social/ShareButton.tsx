"use client"

import { Button } from '@/components/ui/button'
import { Share2, Copy, Twitter, Facebook } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'

interface ShareButtonProps {
    title: string
    text?: string
    url?: string
}

export function ShareButton({ title, text, url }: ShareButtonProps) {
    const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '')

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title,
                    text,
                    url: shareUrl,
                })
            } catch (error) {
                console.error('Error sharing:', error)
            }
        } else {
            copyToClipboard()
        }
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shareUrl)
        toast.success("Link copied to clipboard!")
    }

    const shareToSocial = (platform: 'twitter' | 'facebook' | 'whatsapp') => {
        let link = ''
        const encodedText = encodeURIComponent(text || title)
        const encodedUrl = encodeURIComponent(shareUrl)

        switch (platform) {
            case 'twitter':
                link = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`
                break
            case 'facebook':
                link = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
                break
            case 'whatsapp':
                link = `https://wa.me/?text=${encodedText}%20${encodedUrl}`
                break
        }

        window.open(link, '_blank', 'width=600,height=400')
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Share2 className="h-4 w-4" />
                    Share
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={copyToClipboard}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Link
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('twitter')}>
                    <Twitter className="h-4 w-4 mr-2" />
                    Twitter
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => shareToSocial('facebook')}>
                    <Facebook className="h-4 w-4 mr-2" />
                    Facebook
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
