'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, Heart, Copy, ExternalLink, Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { trackEvent } from '@/components/analytics';

// Mock data for prompt library - World-class trending prompts
const prompts = [
  {
    id: 1,
    title: 'Epic Cinematic Drone Shot',
    description: 'Award-winning aerial cinematography with dramatic golden hour lighting',
    prompt: 'Cinematic aerial drone shot soaring over misty mountain peaks at golden hour, volumetric god rays breaking through clouds, sweeping camera movement, epic landscape cinematography, 8K resolution, professional color grading, RED camera quality --ar 16:9',
    category: 'Cinematography',
    platform: 'Sora',
    tags: ['drone', 'cinematic', 'mountains', 'epic', 'aerial'],
    likes: 1245,
    rating: 4.9,
    author: 'CineMaster Pro',
    featured: true
  },
  {
    id: 2,
    title: 'Hyperrealistic Cyberpunk Portrait',
    description: 'Stunning futuristic character with neon lighting and intricate details',
    prompt: 'Hyperrealistic portrait of a cyberpunk hacker, neon blue and pink hair, glowing circuit tattoos, holographic interface reflections in eyes, dark urban background with neon signs, high contrast dramatic lighting, octane render quality, 8K, trending on ArtStation --ar 2:3 --v 6 --style raw',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['cyberpunk', 'portrait', 'neon', 'futuristic', 'hyperrealistic'],
    likes: 2389,
    rating: 4.9,
    author: 'NeonDreams',
    featured: true
  },
  {
    id: 3,
    title: 'Abstract Liquid Gold Motion',
    description: 'Mesmerizing fluid simulation with metallic textures',
    prompt: 'Abstract liquid gold pouring and splashing in slow motion, metallic reflections, black background, macro photography, high-speed camera capture at 1000fps, dramatic lighting, photorealistic, 8K, luxury aesthetic, cinema4d render quality',
    category: 'Abstract',
    platform: 'Veo 3',
    tags: ['abstract', 'gold', 'liquid', 'motion', 'luxury'],
    likes: 1567,
    rating: 4.8,
    author: 'AbstractVision',
    featured: true
  },
  {
    id: 4,
    title: 'Luxury Product Photography',
    description: 'Professional commercial shot with perfect lighting and composition',
    prompt: 'Professional product photography of a luxury perfume bottle on white marble, soft diffused lighting from top, subtle shadows, water droplets on surface, minimalist composition, shot with Phase One camera, commercial quality, 8K resolution, perfect reflections',
    category: 'Product',
    platform: 'DALL-E',
    tags: ['product', 'luxury', 'commercial', 'photography', 'minimalist'],
    likes: 1823,
    rating: 4.9,
    author: 'StudioElite',
    featured: true
  },
  {
    id: 5,
    title: 'Wildlife Documentary Masterpiece',
    description: 'National Geographic quality wildlife cinematography',
    prompt: 'Close-up cinematic shot of a majestic lion at sunrise in African savanna, golden hour lighting, dust particles in air, shallow depth of field, National Geographic quality, wildlife documentary cinematography, shot with Sony A1 + 600mm lens, 8K RAW, cinematic color grade',
    category: 'Nature',
    platform: 'Sora',
    tags: ['wildlife', 'documentary', 'lion', 'cinematic', 'nature'],
    likes: 1934,
    rating: 4.9,
    author: 'WildFrame',
    featured: false
  },
  {
    id: 6,
    title: 'Futuristic Architecture Vision',
    description: 'Stunning modern building with organic flowing design',
    prompt: 'Futuristic white architecture with flowing organic curves, parametric design, sunset lighting, glass and concrete materials, surrounded by reflecting pools, Zaha Hadid style, architectural photography, drone perspective, 8K, photorealistic render --ar 16:9',
    category: 'Architecture',
    platform: 'Qwen.ai',
    tags: ['architecture', 'futuristic', 'modern', 'parametric', 'design'],
    likes: 1456,
    rating: 4.7,
    author: 'ArchVision',
    featured: false
  },
  {
    id: 7,
    title: 'Fantasy Dragon Battle Scene',
    description: 'Epic fantasy illustration with dramatic action and lighting',
    prompt: 'Epic battle scene between dragon and knight, volumetric lighting from fire breath, dramatic composition, fantasy art, highly detailed armor and scales, stormy sky background, cinematic atmosphere, digital painting masterpiece, trending on ArtStation, 4K --ar 21:9',
    category: 'Fantasy',
    platform: 'Midjourney',
    tags: ['fantasy', 'dragon', 'epic', 'battle', 'cinematic'],
    likes: 2145,
    rating: 4.8,
    author: 'FantasyRealm',
    featured: false
  },
  {
    id: 8,
    title: 'Minimal Japanese Zen Garden',
    description: 'Peaceful meditation space with perfect composition',
    prompt: 'Minimalist Japanese zen garden, raked sand patterns, single bonsai tree, stone elements, soft morning mist, peaceful atmosphere, architectural photography, natural lighting, symmetrical composition, wabi-sabi aesthetic, 8K resolution --ar 4:5',
    category: 'Architecture',
    platform: 'DALL-E',
    tags: ['zen', 'minimal', 'japanese', 'peaceful', 'garden'],
    likes: 1678,
    rating: 4.8,
    author: 'ZenFrames',
    featured: false
  },
  {
    id: 9,
    title: 'Sci-Fi Spaceship Interior',
    description: 'Detailed futuristic command center with holographic displays',
    prompt: 'High-tech spaceship command center interior, holographic displays floating in air, blue and cyan lighting, sleek metallic surfaces, captain\'s chair in foreground, stars visible through large windows, sci-fi movie quality, octane render, 8K, blade runner atmosphere',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['sci-fi', 'spaceship', 'futuristic', 'technology', 'interior'],
    likes: 1789,
    rating: 4.7,
    author: 'SciFiWorlds',
    featured: false
  },
  {
    id: 10,
    title: 'Fashion Editorial Portrait',
    description: 'High-end fashion photography with dramatic styling',
    prompt: 'High fashion editorial portrait, model in avant-garde haute couture dress, dramatic makeup, studio lighting with colored gels, white background, Vogue quality, shot by Annie Leibovitz style, medium format camera, professional retouching, 8K resolution --ar 4:5',
    category: 'Fashion',
    platform: 'DALL-E',
    tags: ['fashion', 'editorial', 'haute couture', 'portrait', 'professional'],
    likes: 1523,
    rating: 4.6,
    author: 'FashionLens',
    featured: false
  },
  {
    id: 11,
    title: 'Magical Forest Wonderland',
    description: 'Enchanted forest with bioluminescent plants and fairy lights',
    prompt: 'Enchanted forest at twilight, bioluminescent mushrooms and flowers, glowing fireflies, magical particles in air, misty atmosphere, fairy tale aesthetic, fantasy landscape, highly detailed, trending on Pinterest, digital art masterpiece, 4K --niji 5',
    category: 'Fantasy',
    platform: 'Midjourney',
    tags: ['fantasy', 'forest', 'magical', 'bioluminescent', 'enchanted'],
    likes: 2234,
    rating: 4.9,
    author: 'MagicForest',
    featured: false
  },
  {
    id: 12,
    title: 'Street Photography Urban Life',
    description: 'Authentic candid moment in bustling city environment',
    prompt: 'Cinematic street photography, rainy Tokyo street at night, neon reflections on wet pavement, pedestrians with umbrellas, shallow depth of field, documentary style, authentic moment, shot with Leica M11, Kodak Portra aesthetic, 8K, cinematic color grade',
    category: 'Cinematography',
    platform: 'Sora',
    tags: ['street', 'urban', 'night', 'cinematic', 'documentary'],
    likes: 1867,
    rating: 4.8,
    author: 'UrbanStories',
    featured: false
  },
  {
    id: 13,
    title: 'Underwater Coral Reef Paradise',
    description: 'Vibrant marine life in crystal clear tropical waters',
    prompt: 'Underwater shot of vibrant coral reef ecosystem, tropical fish swimming through crystal clear water, sun rays penetrating from surface, marine life documentary quality, shot with RED camera in underwater housing, 8K, National Geographic cinematography style',
    category: 'Nature',
    platform: 'Veo 3',
    tags: ['underwater', 'coral', 'marine', 'tropical', 'documentary'],
    likes: 1645,
    rating: 4.7,
    author: 'OceanFilms',
    featured: false
  },
  {
    id: 14,
    title: 'Anime Character Masterpiece',
    description: 'Beautiful anime illustration with stunning detail and lighting',
    prompt: 'Beautiful anime girl with long flowing silver hair, blue glowing eyes, detailed facial features, cherry blossoms falling around her, soft lighting, Studio Ghibli meets makoto shinkai style, highly detailed, trending on pixiv, professional anime art, 4K --niji 5 --ar 2:3',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['anime', 'character', 'beautiful', 'detailed', 'trending'],
    likes: 3456,
    rating: 4.9,
    author: 'AnimeArtist',
    featured: false
  },
  {
    id: 15,
    title: '3D Geometric Abstract Art',
    description: 'Modern abstract sculpture with perfect lighting',
    prompt: '3D abstract geometric sculpture, chrome and glass materials, colorful gradient lighting, studio photography, minimalist background, octane render, photorealistic, 8K, trending on Behance, modern art installation aesthetic',
    category: 'Abstract',
    platform: 'DALL-E',
    tags: ['3d', 'geometric', 'abstract', 'modern', 'sculpture'],
    likes: 1234,
    rating: 4.6,
    author: 'AbstractStudio',
    featured: false
  },
  {
    id: 16,
    title: 'Vintage Cafe Interior',
    description: 'Cozy European cafe with warm atmosphere',
    prompt: 'Cozy vintage cafe interior, wooden furniture, warm Edison bulb lighting, books on shelves, steaming coffee on table, plants in corners, afternoon sunlight streaming through window, nostalgic atmosphere, highly detailed, architectural photography, 8K --ar 16:9',
    category: 'Architecture',
    platform: 'Qwen.ai',
    tags: ['cafe', 'vintage', 'cozy', 'interior', 'warm'],
    likes: 1456,
    rating: 4.7,
    author: 'InteriorVibes',
    featured: false
  },
  {
    id: 17,
    title: 'Sports Action Photography',
    description: 'Dynamic athlete in mid-motion with perfect timing',
    prompt: 'Professional sports photography, basketball player mid-dunk, frozen action, dramatic lighting from above, sweat droplets visible, shallow depth of field, stadium atmosphere, shot with Canon R5 + 70-200mm f/2.8, sports illustrated quality, 8K',
    category: 'Cinematography',
    platform: 'Sora',
    tags: ['sports', 'action', 'dynamic', 'athlete', 'professional'],
    likes: 1567,
    rating: 4.6,
    author: 'SportShots',
    featured: false
  },
  {
    id: 18,
    title: 'Mystical Potion Laboratory',
    description: 'Alchemist workshop with glowing magical elements',
    prompt: 'Medieval alchemist laboratory, shelves filled with glowing potions in various colors, bubbling cauldrons, floating spell books, candlelight illumination, mystical atmosphere, fantasy setting, concept art quality, highly detailed, trending on ArtStation, 4K',
    category: 'Fantasy',
    platform: 'Midjourney',
    tags: ['alchemy', 'fantasy', 'magical', 'laboratory', 'mystical'],
    likes: 1789,
    rating: 4.8,
    author: 'FantasyCraft',
    featured: false
  },
  {
    id: 19,
    title: 'Luxury Car Commercial Shot',
    description: 'High-end automotive photography with dramatic presentation',
    prompt: 'Luxury sports car in studio, dramatic lighting with colored gels, reflective black floor, smoke effects, commercial photography quality, shot with Phase One camera, automotive advertising style, perfect reflections, 8K resolution --ar 21:9',
    category: 'Product',
    platform: 'DALL-E',
    tags: ['automotive', 'luxury', 'commercial', 'dramatic', 'professional'],
    likes: 1923,
    rating: 4.7,
    author: 'AutoVisuals',
    featured: false
  },
  {
    id: 20,
    title: 'Northern Lights Spectacle',
    description: 'Breathtaking aurora borealis over winter landscape',
    prompt: 'Aurora borealis dancing over snowy mountain landscape, vibrant green and purple lights in sky, lone cabin with warm window light, star-filled sky, winter wonderland, landscape photography masterpiece, shot with Sony A7RV, long exposure, 8K --ar 16:9',
    category: 'Nature',
    platform: 'Sora',
    tags: ['aurora', 'northern lights', 'landscape', 'winter', 'spectacular'],
    likes: 2134,
    rating: 4.9,
    author: 'NatureMasters',
    featured: false
  },
  {
    id: 21,
    title: 'Steampunk Airship Design',
    description: 'Intricate Victorian-era flying machine with mechanical details',
    prompt: 'Detailed steampunk airship with brass and copper machinery, intricate gears and steam pipes, Victorian era aesthetic, flying over industrial city, sunset lighting, concept art quality, highly detailed, dieselpunk atmosphere, 8K --ar 16:9',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['steampunk', 'airship', 'victorian', 'mechanical', 'detailed'],
    likes: 1678,
    rating: 4.7,
    author: 'SteamCraft',
    featured: false
  },
  {
    id: 22,
    title: 'Minimalist Product Mockup',
    description: 'Clean modern product presentation with perfect shadows',
    prompt: 'Minimalist product mockup, smartphone floating with soft shadows, white background, studio lighting, clean composition, commercial photography, professional product design presentation, 8K, Apple aesthetic --ar 1:1',
    category: 'Product',
    platform: 'DALL-E',
    tags: ['minimalist', 'mockup', 'clean', 'modern', 'product'],
    likes: 1345,
    rating: 4.6,
    author: 'MockupPro',
    featured: false
  },
  {
    id: 23,
    title: 'Epic Storm Timelapse',
    description: 'Dramatic weather phenomenon with powerful cinematography',
    prompt: 'Timelapse of massive supercell thunderstorm forming over plains, dramatic cloud formations, lightning strikes, golden hour to twilight transition, epic cinematography, weather photography masterpiece, shot with 8K cinema camera, National Geographic quality --ar 21:9',
    category: 'Nature',
    platform: 'Veo 3',
    tags: ['storm', 'weather', 'timelapse', 'dramatic', 'epic'],
    likes: 1856,
    rating: 4.8,
    author: 'StormChasers',
    featured: false
  },
  {
    id: 24,
    title: 'Ethereal Portrait Art',
    description: 'Dreamy fashion portrait with artistic lighting and effects',
    prompt: 'Ethereal fashion portrait, model with flowing fabric, soft diffused lighting, double exposure effect with flowers, dreamy atmosphere, pastel color palette, fine art photography, shot with Hasselblad, professional retouching, editorial quality, 8K --ar 4:5',
    category: 'Fashion',
    platform: 'DALL-E',
    tags: ['portrait', 'ethereal', 'dreamy', 'artistic', 'fashion'],
    likes: 1567,
    rating: 4.7,
    author: 'DreamPortraits',
    featured: false
  },
  {
    id: 25,
    title: 'Cyberpunk Night Market',
    description: 'Bustling futuristic Asian street market with neon atmosphere',
    prompt: 'Cyberpunk night market in Neo-Tokyo, food stalls with neon signs, steam rising from cooking, crowded street with diverse people, holographic advertisements, rain-slicked ground reflecting lights, blade runner aesthetic, cinematic composition, 8K --ar 16:9',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['cyberpunk', 'market', 'neon', 'futuristic', 'urban'],
    likes: 2234,
    rating: 4.9,
    author: 'NeoWorlds',
    featured: false
  },
  {
    id: 26,
    title: 'Macro Nature Photography',
    description: 'Extreme close-up of insect with incredible detail',
    prompt: 'Macro photography of butterfly on flower, extreme close-up showing wing pattern details, morning dew drops, soft natural lighting, shallow depth of field, National Geographic quality, shot with macro lens 100mm f/2.8, 8K resolution',
    category: 'Nature',
    platform: 'DALL-E',
    tags: ['macro', 'butterfly', 'nature', 'detailed', 'photography'],
    likes: 1445,
    rating: 4.6,
    author: 'MacroMasters',
    featured: false
  },
  {
    id: 27,
    title: 'Architectural Marvel Interior',
    description: 'Stunning modern atrium with geometric skylights',
    prompt: 'Modern architectural interior, massive atrium with geometric glass skylight, natural sunlight creating dramatic shadows, people for scale, minimalist design, concrete and glass materials, architectural photography masterpiece, 8K, symmetric composition --ar 9:16',
    category: 'Architecture',
    platform: 'Qwen.ai',
    tags: ['architecture', 'interior', 'modern', 'geometric', 'dramatic'],
    likes: 1678,
    rating: 4.7,
    author: 'ArchMarvels',
    featured: false
  },
  {
    id: 28,
    title: 'Food Photography Delicious',
    description: 'Mouthwatering culinary shot with perfect styling',
    prompt: 'Professional food photography, gourmet burger with perfect layers, fresh ingredients, steam rising, dark moody background, dramatic side lighting, commercial quality, shot with macro lens, culinary magazine style, 8K resolution --ar 4:5',
    category: 'Product',
    platform: 'DALL-E',
    tags: ['food', 'culinary', 'photography', 'delicious', 'professional'],
    likes: 1534,
    rating: 4.8,
    author: 'FoodLens',
    featured: false
  },
  {
    id: 29,
    title: 'Space Exploration Scene',
    description: 'Astronaut on alien planet with stunning cosmic backdrop',
    prompt: 'Lone astronaut standing on alien planet surface, massive ringed planet in sky, colorful nebula background, dramatic lighting from distant sun, sci-fi realism, cinematic composition, space exploration aesthetic, octane render quality, 8K --ar 16:9',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['space', 'astronaut', 'alien', 'cosmic', 'exploration'],
    likes: 2456,
    rating: 4.9,
    author: 'CosmicVisions',
    featured: false
  },
  {
    id: 30,
    title: 'Watercolor Art Portrait',
    description: 'Delicate artistic portrait with flowing watercolor effects',
    prompt: 'Beautiful watercolor portrait, woman with flowers in hair, soft color palette, flowing paint effects, artistic interpretation, traditional art meets digital, highly detailed face, dreamy atmosphere, trending on Instagram, 4K --ar 2:3',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['watercolor', 'portrait', 'artistic', 'delicate', 'beautiful'],
    likes: 1823,
    rating: 4.8,
    author: 'WatercolorDreams',
    featured: false
  }
];

const categories = ['All', 'Cinematography', 'Character', 'Abstract', 'Product', 'Nature', 'Architecture', 'Fantasy', 'Sci-Fi', 'Fashion'];
const platforms = ['All Platforms', 'Sora', 'Midjourney', 'Veo 3', 'DALL-E', 'Qwen.ai'];

export function LibraryPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All Platforms');
  const [sortBy, setSortBy] = useState('popular');

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    if (value.length >= 3) {
      trackEvent.librarySearch(value);
    }
  };

  const handlePlatformFilter = (platform: string) => {
    setSelectedPlatform(platform);
    if (platform !== 'All Platforms') {
      trackEvent.platformFilter(platform);
    }
  };

  const copyToClipboard = async (text: string, title: string, platform: string) => {
    try {
      await navigator.clipboard.writeText(text);
      
      // Track the copy event
      trackEvent.promptCopied(title, platform);
      
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
                  onChange={(e) => handleSearch(e.target.value)}
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

              <Select value={selectedPlatform} onValueChange={handlePlatformFilter}>
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
                    onClick={() => copyToClipboard(prompt.prompt, prompt.title, prompt.platform)}
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