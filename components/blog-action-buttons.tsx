'use client';

import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2, Bookmark } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface BlogActionButtonsProps {
  title: string;
  url?: string;
}

export function BlogActionButtons({ title, url }: BlogActionButtonsProps) {
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: url || window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    // Here you would typically save to localStorage or send to a backend
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    if (saved) {
      const updatedPosts = savedPosts.filter((savedUrl: string) => savedUrl !== window.location.href);
      localStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
    } else {
      savedPosts.push(window.location.href);
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    }
  };

  return (
    <>
      {/* Back Button */}
      <Link href="/blog">
        <Button variant="ghost" className="mb-6 hover:bg-muted">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Blog
        </Button>
      </Link>

      {/* Action Buttons - to be used in the action section */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSave}
          className={saved ? 'bg-primary/10 border-primary' : ''}
        >
          <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>
    </>
  );
}

export function BackButton() {
  return (
    <Link href="/blog">
      <Button variant="ghost" className="mb-6 hover:bg-muted">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Blog
      </Button>
    </Link>
  );
}

export function ActionButtons({ title, url }: BlogActionButtonsProps) {
  const [saved, setSaved] = useState(false);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url: url || window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const handleSave = () => {
    setSaved(!saved);
    // Here you would typically save to localStorage or send to a backend
    const savedPosts = JSON.parse(localStorage.getItem('savedPosts') || '[]');
    if (saved) {
      const updatedPosts = savedPosts.filter((savedUrl: string) => savedUrl !== window.location.href);
      localStorage.setItem('savedPosts', JSON.stringify(updatedPosts));
    } else {
      savedPosts.push(window.location.href);
      localStorage.setItem('savedPosts', JSON.stringify(savedPosts));
    }
  };

  return (
    <div className="flex items-center gap-4 mb-8">
      <Button variant="outline" size="sm" onClick={handleShare}>
        <Share2 className="h-4 w-4 mr-2" />
        Share
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={handleSave}
        className={saved ? 'bg-primary/10 border-primary' : ''}
      >
        <Bookmark className={`h-4 w-4 mr-2 ${saved ? 'fill-current' : ''}`} />
        {saved ? 'Saved' : 'Save'}
      </Button>
    </div>
  );
}