'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Calendar, Copy, Heart, Trash2, Download, Filter } from 'lucide-react';

// Mock data for prompt history
const promptHistory = [
  {
    id: 1,
    prompt: 'Aerial drone shot of a vast mountain landscape at golden hour, cinematic cinematography, smooth camera movement, 4K resolution, professional color grading',
    platform: 'Sora',
    category: 'Cinematography',
    createdAt: '2025-01-10T14:30:00Z',
    tags: ['drone', 'landscape', 'cinematic'],
    favorite: true,
    creditsUsed: 5
  },
  {
    id: 2,
    prompt: 'Portrait of a cyberpunk character with neon hair, glowing eyes, futuristic clothing, dark city background, high contrast lighting --ar 2:3 --v 6',
    platform: 'Midjourney',
    category: 'Character',
    createdAt: '2025-01-10T12:15:00Z',
    tags: ['cyberpunk', 'portrait', 'futuristic'],
    favorite: false,
    creditsUsed: 3
  },
  {
    id: 3,
    prompt: 'Abstract fluid motion graphics, colorful paint splashes, dynamic movement, high-speed camera capture, artistic composition',
    platform: 'Veo 3',
    category: 'Abstract',
    createdAt: '2025-01-09T16:45:00Z',
    tags: ['abstract', 'motion', 'colorful'],
    favorite: true,
    creditsUsed: 4
  },
  {
    id: 4,
    prompt: 'Professional product photography of a sleek smartphone, white background, studio lighting, minimal shadows, commercial quality',
    platform: 'DALL-E',
    category: 'Product',
    createdAt: '2025-01-09T10:20:00Z',
    tags: ['product', 'commercial', 'clean'],
    favorite: false,
    creditsUsed: 2
  },
  {
    id: 5,
    prompt: 'Close-up shot of a wild eagle in flight, natural habitat, documentary style, sharp focus, natural lighting, 60fps smooth motion',
    platform: 'Sora',
    category: 'Nature',
    createdAt: '2025-01-08T18:30:00Z',
    tags: ['wildlife', 'documentary', 'nature'],
    favorite: false,
    creditsUsed: 5
  }
];

const platforms = ['All Platforms', 'Sora', 'Midjourney', 'Veo 3', 'DALL-E'];
const categories = ['All Categories', 'Cinematography', 'Character', 'Abstract', 'Product', 'Nature'];

export function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const filteredHistory = promptHistory.filter(item => {
    const matchesSearch = item.prompt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesPlatform = selectedPlatform === 'All Platforms' || item.platform === selectedPlatform;
    const matchesCategory = selectedCategory === 'All Categories' || item.category === selectedCategory;
    const matchesFavorites = !showFavoritesOnly || item.favorite;
    
    return matchesSearch && matchesPlatform && matchesCategory && matchesFavorites;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const totalCreditsUsed = promptHistory.reduce((sum, item) => sum + item.creditsUsed, 0);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container-max section-padding py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl md:text-5xl font-bold gradient-text">
            Prompt History
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            View, manage, and reuse your generated AI prompts.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {promptHistory.length}
              </div>
              <p className="text-muted-foreground">Total Prompts</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-secondary mb-2">
                {totalCreditsUsed}
              </div>
              <p className="text-muted-foreground">Credits Used</p>
            </CardContent>
          </Card>
          
          <Card className="border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {promptHistory.filter(p => p.favorite).length}
              </div>
              <p className="text-muted-foreground">Favorites</p>
            </CardContent>
          </Card>
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

              <Button
                variant={showFavoritesOnly ? "default" : "outline"}
                onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                className="w-full"
              >
                <Heart className={`mr-2 h-4 w-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
                Favorites Only
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            Showing {filteredHistory.length} of {promptHistory.length} prompts
          </p>
          <Button variant="outline" size="sm">
            <Filter className="mr-2 h-4 w-4" />
            Advanced Filters
          </Button>
        </div>

        {/* History Grid */}
        <div className="space-y-4">
          {filteredHistory.map((item, index) => (
            <Card 
              key={item.id}
              className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Badge variant="secondary" className="text-xs">
                        {item.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-xs text-muted-foreground">
                        {item.creditsUsed} credits
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {/* Toggle favorite */}}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Heart className={`h-4 w-4 ${item.favorite ? 'fill-primary text-primary' : ''}`} />
                      </Button>
                    </div>
                  </div>

                  {/* Prompt Content */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm font-mono leading-relaxed">
                      {item.prompt}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        #{tag}
                      </Badge>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </Button>
                    </div>
                    
                    <Button size="sm" variant="ghost" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">
              No prompts found matching your criteria.
            </p>
            <Button onClick={() => {
              setSearchTerm('');
              setSelectedPlatform('All Platforms');
              setSelectedCategory('All Categories');
              setShowFavoritesOnly(false);
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}