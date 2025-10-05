'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Heart, Copy, ExternalLink, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for prompt library
const prompts = [
  {
    id: 1,
    title: 'Cinematic Drone Shot',
    description: 'Perfect for creating epic establishing shots with smooth camera movement',
    prompt: 'Aerial drone shot of a vast mountain landscape at golden hour, cinematic cinematography, smooth camera movement, 4K resolution, professional color grading',
    category: 'Cinematography',
    platform: 'Sora',
    tags: ['drone', 'landscape', 'cinematic'],
    likes: 245,
    rating: 4.8,
    author: 'AI Prompt Team',
    featured: true
  },
  {
    id: 2,
    title: 'Cyberpunk Character',
    description: 'Futuristic character design with neon aesthetics',
    prompt: 'Portrait of a cyberpunk character with neon hair, glowing eyes, futuristic clothing, dark city background, high contrast lighting --ar 2:3 --v 6',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['cyberpunk', 'portrait', 'futuristic'],
    likes: 189,
    rating: 4.7,
    author: 'CyberArt_Pro'
  },
  {
    id: 3,
    title: 'Abstract Art Motion',
    description: 'Dynamic abstract patterns with fluid motion',
    prompt: 'Abstract fluid motion graphics, colorful paint splashes, dynamic movement, high-speed camera capture, artistic composition',
    category: 'Abstract',
    platform: 'Veo 3',
    tags: ['abstract', 'motion', 'colorful'],
    likes: 156,
    rating: 4.6,
    author: 'AbstractMind'
  },
  {
    id: 4,
    title: 'Product Photography',
    description: 'Clean product shots with studio lighting',
    prompt: 'Professional product photography of a sleek smartphone, white background, studio lighting, minimal shadows, commercial quality',
    category: 'Product',
    platform: 'DALL-E',
    tags: ['product', 'commercial', 'clean'],
    likes: 203,
    rating: 4.9,
    author: 'StudioPro'
  },
  {
    id: 5,
    title: 'Nature Documentary',
    description: 'Wildlife footage with natural behavior',
    prompt: 'Close-up shot of a wild eagle in flight, natural habitat, documentary style, sharp focus, natural lighting, 60fps smooth motion',
    category: 'Nature',
    platform: 'Sora',
    tags: ['wildlife', 'documentary', 'nature'],
    likes: 167,
    rating: 4.5,
    author: 'WildlifePro'
  },
  {
    id: 6,
    title: 'Minimalist Architecture',
    description: 'Clean architectural compositions',
    prompt: 'Minimalist modern building facade, clean lines, geometric patterns, natural lighting, architectural photography style',
    category: 'Architecture',
    platform: 'Midjourney',
    tags: ['minimalist', 'architecture', 'geometric'],
    likes: 134,
    rating: 4.4,
    author: 'ArchDesign'
  }
];

const categories = ['All', 'Cinematography', 'Character', 'Abstract', 'Product', 'Nature', 'Architecture'];
const platforms = ['All Platforms', 'Sora', 'Midjourney', 'Veo 3', 'DALL-E', 'Qwen.ai'];

export function LibraryPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [sortBy, setSortBy] = useState('popular');

  const copyToClipboard = async (text: string, title: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Prompt Copied!",
        description: `"${title}" has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Failed to Copy",
        description: "Please try again or copy manually.",
        variant: "destructive",
      });
    }
  };

  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory;
    const matchesPlatform = selectedPlatform === 'All Platforms' || prompt.platform === selectedPlatform;
    
    return matchesSearch && matchesCategory && matchesPlatform;
  });

  const sortedPrompts = [...filteredPrompts].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.likes - a.likes;
      case 'rating':
        return b.rating - a.rating;
      case 'recent':
        return b.id - a.id;
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-max section-padding py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Prompt Library
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover and use professional AI prompts curated by experts and the community.
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue placeholder="Platform" />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map(platform => (
                    <SelectItem key={platform} value={platform}>
                      {platform}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="popular">Most Popular</SelectItem>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="recent">Most Recent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {sortedPrompts.length} of {prompts.length} prompts
          </p>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        {/* Prompt Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedPrompts.map((prompt, index) => (
            <Card 
              key={prompt.id}
              className={`group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in ${
                prompt.featured ? 'ring-2 ring-primary/20' : ''
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary" className="text-xs">
                        {prompt.platform}
                      </Badge>
                      {prompt.featured && (
                        <Badge className="text-xs bg-primary/10 text-primary">
                          Featured
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {prompt.title}
                    </CardTitle>
                    <CardDescription>{prompt.description}</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-3 rounded-lg">
                  <p className="text-sm font-mono leading-relaxed line-clamp-3">
                    {prompt.prompt}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1">
                  {prompt.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1" />
                      {prompt.likes}
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1 fill-primary text-primary" />
                      {prompt.rating}
                    </div>
                  </div>
                  <span>by {prompt.author}</span>
                </div>

                <div className="flex space-x-2 pt-2">
                  <Button 
                    size="sm" 
                    className="flex-1 btn-primary"
                    onClick={() => copyToClipboard(prompt.prompt, prompt.title)}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Use Prompt
                  </Button>
                  <Button variant="outline" size="sm">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {sortedPrompts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No prompts found matching your criteria.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedPlatform('All Platforms');
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}