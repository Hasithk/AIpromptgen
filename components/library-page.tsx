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
  },
  {
    id: 31,
    title: 'Cyberpunk City Nightscape',
    description: 'Sprawling neon-drenched metropolis with towering skyscrapers and holographic billboards',
    prompt: 'Cyberpunk megacity at night, towering neon-lit skyscrapers, holographic billboards in Japanese and English, flying cars weaving between buildings, rain-soaked streets reflecting neon pink and cyan lights, dense urban atmosphere, Blade Runner meets Ghost in the Shell aesthetic, volumetric fog, cinematic wide shot, hyper-detailed, 8K resolution --ar 16:9 --v 7',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['cyberpunk', 'city', 'neon', 'night', 'futuristic'],
    likes: 2567,
    rating: 4.9,
    author: 'NeonCityscape',
    featured: true
  },
  {
    id: 32,
    title: 'Close-Up Portrait Photography',
    description: 'Intimate close-up portrait with sharp detail on skin texture and eyes',
    prompt: 'Extreme close-up portrait photography of a person\'s face, sharp focus on eyes and skin texture, natural freckles visible, soft golden hour side lighting, shallow depth of field with blurred background, Canon EOS R5 with 100mm macro lens, natural skin tones, emotional expression, editorial quality, 8K ultra-detailed --ar 4:5 --style raw',
    category: 'Fashion',
    platform: 'Midjourney',
    tags: ['close-up', 'portrait', 'photography', 'detailed', 'editorial'],
    likes: 1876,
    rating: 4.8,
    author: 'PortraitMaster',
    featured: false
  },
  {
    id: 33,
    title: 'Giant Dragon Fantasy Scene',
    description: 'Colossal dragon towering over a medieval kingdom with fire and destruction',
    prompt: 'Massive ancient dragon with iridescent scales towering over a medieval castle, breathing fire into stormy sky, knights on horseback fleeing below, dramatic lightning illuminating the scene, epic fantasy art, highly detailed scales and wing membranes, volumetric smoke and embers, cinematic composition, concept art masterpiece, trending on ArtStation, 8K --ar 21:9 --v 7',
    category: 'Fantasy',
    platform: 'Midjourney',
    tags: ['dragon', 'fantasy', 'epic', 'medieval', 'fire'],
    likes: 2890,
    rating: 4.9,
    author: 'DragonForge',
    featured: true
  },
  {
    id: 34,
    title: 'Minimalist Design Composition',
    description: 'Clean, elegant minimalist artwork with geometric shapes and muted tones',
    prompt: 'Ultra-minimalist abstract composition, single geometric shape floating in negative space, soft muted earth tones, subtle gradient background, clean lines, contemporary art gallery aesthetic, perfect balance and harmony, Scandinavian design influence, high-end print quality, 8K resolution --ar 1:1',
    category: 'Abstract',
    platform: 'DALL-E',
    tags: ['minimalist', 'design', 'geometric', 'clean', 'modern'],
    likes: 1345,
    rating: 4.7,
    author: 'MinimalArt',
    featured: false
  },
  {
    id: 35,
    title: 'Dramatic Cinematic Landscape',
    description: 'Sweeping cinematic vista with dramatic weather and moody atmosphere',
    prompt: 'Dramatic cinematic landscape, vast canyon with layered rock formations, storm clouds rolling in with god rays breaking through, lone figure standing on cliff edge for scale, Deakins-style cinematography, anamorphic lens flare, cinematic color grading with teal and orange, shot on ARRI Alexa 65, breathtaking sense of scale, 8K --ar 2.39:1',
    category: 'Cinematography',
    platform: 'Sora',
    tags: ['cinematic', 'dramatic', 'landscape', 'epic', 'moody'],
    likes: 2134,
    rating: 4.9,
    author: 'CinemaScapes',
    featured: false
  },
  {
    id: 36,
    title: '1950s Street Photography',
    description: 'Nostalgic retro street scene capturing the essence of 1950s America',
    prompt: '1950s American street photography, classic cars parked along main street, diner with neon sign, people in period-accurate clothing, warm Kodachrome color palette, vintage film grain, golden afternoon light, small-town America nostalgia, shot on Leica IIIf, authentic retro aesthetic, documentary style, 8K resolution --ar 3:2 --style raw',
    category: 'Cinematography',
    platform: 'Midjourney',
    tags: ['1950s', 'retro', 'vintage', 'street', 'nostalgia'],
    likes: 1654,
    rating: 4.7,
    author: 'RetroLens',
    featured: false
  },
  {
    id: 37,
    title: 'Bright Modern Interior Design',
    description: 'Sun-filled contemporary living space with clean lines and vibrant accents',
    prompt: 'Bright modern interior design, open-plan living room flooded with natural sunlight, floor-to-ceiling windows, white walls with pops of vibrant color, designer furniture, indoor plants, polished concrete floors, Scandinavian-meets-contemporary aesthetic, architectural digest quality, professional interior photography, 8K --ar 16:9',
    category: 'Architecture',
    platform: 'DALL-E',
    tags: ['interior', 'modern', 'bright', 'design', 'contemporary'],
    likes: 1456,
    rating: 4.7,
    author: 'InteriorVision',
    featured: false
  },
  {
    id: 38,
    title: 'Glossy Robot Character',
    description: 'Sleek futuristic robot with reflective chrome surfaces and glowing accents',
    prompt: 'Hyper-detailed glossy robot character, reflective chrome and white ceramic surfaces, glowing blue LED accents in joints and eyes, sleek humanoid form, studio lighting with clean reflections, futuristic product design aesthetic, subtle surface imperfections for realism, octane render quality, dark gradient background, 8K --ar 2:3 --v 7',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['robot', 'glossy', 'chrome', 'futuristic', 'character'],
    likes: 1987,
    rating: 4.8,
    author: 'RoboDesign',
    featured: false
  },
  {
    id: 39,
    title: 'Isometric City Block',
    description: 'Detailed isometric view of a colorful city block with miniature buildings',
    prompt: 'Isometric 3D city block diorama, colorful miniature buildings with tiny details, cafes, shops, and apartments, small people walking on streets, trees and parks, warm afternoon lighting casting soft shadows, clean vector-like aesthetic, game art style, tilt-shift effect, highly detailed, cute and charming, 8K --ar 1:1',
    category: 'Illustration',
    platform: 'Midjourney',
    tags: ['isometric', 'city', '3d', 'miniature', 'colorful'],
    likes: 2123,
    rating: 4.8,
    author: 'IsoWorlds',
    featured: false
  },
  {
    id: 40,
    title: 'Aerial Drone Photography',
    description: 'Breathtaking top-down aerial perspective of stunning natural patterns',
    prompt: 'Aerial drone photography looking straight down, stunning natural patterns in landscape, turquoise river winding through emerald green forest, dramatic contrast between water and land, abstract natural shapes, DJI Mavic 3 Pro quality, golden hour lighting creating long shadows, geographic patterns, National Geographic aerial photography, 8K --ar 4:5',
    category: 'Nature',
    platform: 'DALL-E',
    tags: ['aerial', 'drone', 'topdown', 'nature', 'patterns'],
    likes: 1789,
    rating: 4.8,
    author: 'SkyView',
    featured: false
  },
  {
    id: 41,
    title: 'Extreme Macro Photography',
    description: 'Incredible magnification revealing hidden worlds in everyday objects',
    prompt: 'Extreme macro photography at 5x magnification, water droplet on flower petal acting as natural lens, refracting the world behind it, incredibly sharp focus stacking, vibrant colors, morning dew, visible surface textures at microscopic level, studio flash with diffuser, scientific photography quality, 8K ultra-resolution --ar 1:1',
    category: 'Nature',
    platform: 'DALL-E',
    tags: ['macro', 'extreme', 'closeup', 'nature', 'detailed'],
    likes: 1567,
    rating: 4.7,
    author: 'MacroWorld',
    featured: false
  },
  {
    id: 42,
    title: 'Floating Island Fantasy',
    description: 'Magical floating island with waterfalls cascading into clouds below',
    prompt: 'Magical floating island in the sky, lush green terrain with ancient trees, waterfall cascading off the edge into clouds below, small village with stone cottages, rope bridges connecting smaller floating rocks, golden sunset light, fantasy world-building, Studio Ghibli inspired atmosphere, matte painting quality, highly detailed, 8K --ar 16:9 --v 7',
    category: 'Fantasy',
    platform: 'Midjourney',
    tags: ['floating island', 'fantasy', 'magical', 'sky', 'ghibli'],
    likes: 2456,
    rating: 4.9,
    author: 'SkyRealms',
    featured: true
  },
  {
    id: 43,
    title: 'Anime-Style Character Art',
    description: 'Vibrant anime character illustration with dynamic pose and effects',
    prompt: 'Dynamic anime character illustration, warrior with glowing magical sword, flowing cape and detailed armor, vibrant color palette with electric blue and gold accents, action pose with energy particles swirling, dramatic speed lines, cherry blossom petals in wind, professional anime key visual quality, trending on pixiv, 4K --niji 5 --ar 2:3',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['anime', 'character', 'dynamic', 'warrior', 'vibrant'],
    likes: 3234,
    rating: 4.9,
    author: 'AnimeForge',
    featured: false
  },
  {
    id: 44,
    title: 'Chibi Mascot Design',
    description: 'Adorable chibi-style mascot character perfect for branding and merchandise',
    prompt: 'Adorable chibi mascot character design, cute round proportions with oversized head, big sparkling eyes, cheerful expression, holding a small object, simple clean outfit with brand colors, flat color shading, white background, perfect for logo and merchandise, vector-clean edges, kawaii aesthetic, professional character sheet, 4K --niji 5 --ar 1:1',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['chibi', 'mascot', 'cute', 'branding', 'kawaii'],
    likes: 1876,
    rating: 4.7,
    author: 'ChibiCreator',
    featured: false
  },
  {
    id: 45,
    title: 'Realistic Portrait Painting',
    description: 'Photorealistic digital portrait with painterly quality and rich details',
    prompt: 'Photorealistic digital portrait painting, elderly person with weathered face telling a thousand stories, deep wrinkles and expressive eyes, Rembrandt-style lighting with single light source, rich oil painting texture, warm earth tones, museum-quality fine art, hyperrealistic skin detail, emotional depth, masterpiece quality, 8K --ar 3:4 --style raw',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['portrait', 'realistic', 'painting', 'fine art', 'detailed'],
    likes: 2012,
    rating: 4.9,
    author: 'DigitalMasters',
    featured: false
  },
  {
    id: 46,
    title: 'Portrait with Flowers',
    description: 'Ethereal portrait surrounded by lush floral arrangements',
    prompt: 'Ethereal portrait of a person surrounded by lush blooming flowers, roses, peonies, and wildflowers woven into hair, soft pastel lighting, dreamy bokeh background of flower garden, delicate and romantic atmosphere, fine art photography, shot with Hasselblad medium format, editorial beauty quality, 8K --ar 4:5 --v 7',
    category: 'Fashion',
    platform: 'Midjourney',
    tags: ['portrait', 'flowers', 'ethereal', 'romantic', 'beauty'],
    likes: 1934,
    rating: 4.8,
    author: 'FloralPortrait',
    featured: false
  },
  {
    id: 47,
    title: 'Minimal Flat Illustration',
    description: 'Clean flat design illustration with bold colors and simple shapes',
    prompt: 'Minimal flat illustration, clean geometric shapes, bold primary color palette, simple character or scene with no gradients, thick outlines, modern graphic design aesthetic, perfect for app UI or poster, Bauhaus design influence, negative space usage, vector art quality, crisp edges, 4K --ar 16:9',
    category: 'Illustration',
    platform: 'DALL-E',
    tags: ['flat', 'illustration', 'minimal', 'vector', 'design'],
    likes: 1234,
    rating: 4.6,
    author: 'FlatDesign',
    featured: false
  },
  {
    id: 48,
    title: 'Portrait with Neon Lights',
    description: 'Striking portrait lit by vivid neon colors creating dramatic atmosphere',
    prompt: 'Dramatic portrait lit by neon lights, split lighting with neon pink on one side and electric blue on the other, sharp shadows on face, urban night background with out-of-focus neon signs, cyberpunk aesthetic, high contrast, moody atmosphere, fashion photography meets street style, shot on Sony A7IV, 8K --ar 2:3 --style raw',
    category: 'Fashion',
    platform: 'Midjourney',
    tags: ['portrait', 'neon', 'dramatic', 'cyberpunk', 'moody'],
    likes: 2345,
    rating: 4.8,
    author: 'NeonFaces',
    featured: false
  },
  {
    id: 49,
    title: 'Spaceship Command Deck',
    description: 'Epic sci-fi spaceship exterior or interior with cinematic lighting',
    prompt: 'Massive sci-fi spaceship emerging from hyperspace, sleek angular design with illuminated engine ports, debris field and distant nebula in background, volumetric lighting from nearby star, cinematic space opera composition, hard surface modeling detail, Star Wars meets Expanse aesthetic, concept art quality, matte painting, 8K --ar 21:9 --v 7',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['spaceship', 'sci-fi', 'space', 'epic', 'cinematic'],
    likes: 2567,
    rating: 4.9,
    author: 'SpaceArtist',
    featured: false
  },
  {
    id: 50,
    title: 'Low-Poly 3D Render',
    description: 'Stylized low-polygon 3D artwork with clean facets and soft lighting',
    prompt: 'Low-poly 3D render of a mountain landscape scene, geometric faceted surfaces, soft pastel color gradient sky, clean triangular polygons, stylized trees and clouds, isometric perspective, calm and serene mood, modern indie game art style, soft ambient lighting, Cinema4D quality render, 8K --ar 16:9',
    category: 'Abstract',
    platform: 'DALL-E',
    tags: ['low-poly', '3d', 'geometric', 'stylized', 'render'],
    likes: 1678,
    rating: 4.7,
    author: 'PolyArtist',
    featured: false
  },
  {
    id: 51,
    title: 'Steampunk Inventor Portrait',
    description: 'Victorian-era inventor with brass goggles and intricate mechanical gadgets',
    prompt: 'Steampunk inventor portrait, Victorian-era scientist wearing brass goggles and leather apron, surrounded by intricate clockwork mechanisms and steam-powered gadgets, warm candlelight mixed with green gas lamp glow, workshop filled with gears and blueprints, rich texture detail on leather and metal, cinematic portrait lighting, 8K --ar 2:3 --v 7',
    category: 'Character',
    platform: 'Midjourney',
    tags: ['steampunk', 'inventor', 'victorian', 'portrait', 'mechanical'],
    likes: 1789,
    rating: 4.8,
    author: 'SteamPortraits',
    featured: false
  },
  {
    id: 52,
    title: 'Film-Noir Detective Scene',
    description: 'Classic black and white detective scene with moody shadows and venetian blinds',
    prompt: 'Film-noir detective scene, private investigator in fedora sitting at desk, dramatic venetian blind shadows casting striped light across scene, cigarette smoke curling in light beam, black and white with high contrast, 1940s aesthetic, glass of whiskey, old telephone, moody atmospheric lighting, Humphrey Bogart era, cinematic composition, 8K --ar 16:9 --style raw',
    category: 'Cinematography',
    platform: 'Midjourney',
    tags: ['film-noir', 'detective', 'moody', 'black and white', 'vintage'],
    likes: 1923,
    rating: 4.8,
    author: 'NoirCinema',
    featured: false
  },
  {
    id: 53,
    title: 'Massive Mech Battle Robot',
    description: 'Towering battle mech with heavy armor and weapons in action scene',
    prompt: 'Massive battle mech robot in combat pose, 50 meters tall, heavy armor plating with battle damage and scratches, glowing reactor core visible, missile pods and beam weapons, destroyed cityscape background, dust and debris in air, dramatic low-angle shot, military sci-fi aesthetic, Gundam meets Pacific Rim, concept art, 8K --ar 9:16 --v 7',
    category: 'Sci-Fi',
    platform: 'Midjourney',
    tags: ['mech', 'robot', 'battle', 'sci-fi', 'massive'],
    likes: 2678,
    rating: 4.9,
    author: 'MechWarrior',
    featured: true
  },
  {
    id: 54,
    title: 'Northern Lights Over Mountains',
    description: 'Spectacular aurora borealis display above snow-capped peaks with reflection',
    prompt: 'Spectacular northern lights aurora borealis, vivid green, purple and pink curtains of light dancing across Arctic sky, snow-capped mountain range reflected in perfectly still fjord water, mirror-like reflection, stars visible, lone wooden cabin with warm light, long exposure photography, Sony A7RV, 8K ultra high definition --ar 16:9',
    category: 'Nature',
    platform: 'DALL-E',
    tags: ['aurora', 'northern lights', 'mountains', 'arctic', 'reflection'],
    likes: 2234,
    rating: 4.9,
    author: 'ArcticLights',
    featured: false
  },
  {
    id: 55,
    title: 'Overhead Flat Lay Photography',
    description: 'Perfectly arranged top-down flat lay with curated objects and styling',
    prompt: 'Overhead flat lay photography, perfectly arranged collection of objects on marble surface, travel essentials including camera, passport, sunglasses, coffee cup, and notebook, complementary color scheme, soft even lighting with no harsh shadows, editorial styling, clean composition, Instagram aesthetic, commercial photography quality, 8K --ar 1:1',
    category: 'Product',
    platform: 'DALL-E',
    tags: ['flatlay', 'overhead', 'styling', 'product', 'editorial'],
    likes: 1456,
    rating: 4.7,
    author: 'FlatLayPro',
    featured: false
  },
  {
    id: 56,
    title: 'High-Fashion Editorial Shot',
    description: 'Avant-garde high fashion photography with bold styling and dramatic lighting',
    prompt: 'High-fashion editorial photography, model in bold avant-garde outfit, dramatic sculptural silhouette, striking pose against monochrome backdrop, high contrast lighting with sharp shadows, Vogue Italia aesthetic, styled by top creative director, shot on medium format Hasselblad, professional retouching, runway to editorial quality, 8K --ar 3:4 --style raw',
    category: 'Fashion',
    platform: 'Midjourney',
    tags: ['high-fashion', 'editorial', 'avant-garde', 'vogue', 'dramatic'],
    likes: 1867,
    rating: 4.8,
    author: 'FashionElite',
    featured: false
  },
  {
    id: 57,
    title: 'Minimal Logo Design',
    description: 'Clean and professional minimalist logo with elegant simplicity',
    prompt: 'Minimal logo design, single elegant mark combining letterform and abstract symbol, clean lines with perfect geometry, works in monochrome, scalable from favicon to billboard, modern tech company aesthetic, flat design, white background, professional brand identity quality, vector-sharp edges, timeless and memorable, 4K --ar 1:1',
    category: 'Design',
    platform: 'DALL-E',
    tags: ['logo', 'minimal', 'branding', 'design', 'clean'],
    likes: 1567,
    rating: 4.6,
    author: 'LogoCraft',
    featured: false
  },
  {
    id: 58,
    title: 'Mobile App UI Concept',
    description: 'Sleek mobile application interface design with modern aesthetics',
    prompt: 'Modern mobile app UI design concept, sleek smartphone mockup showing clean interface, glassmorphism card elements, smooth gradients, intuitive navigation, dark mode with vibrant accent colors, iOS-style design language, floating device with soft shadow, professional UI/UX presentation, Dribbble trending quality, 8K --ar 9:16',
    category: 'Design',
    platform: 'DALL-E',
    tags: ['mobile', 'app', 'UI', 'design', 'modern'],
    likes: 1345,
    rating: 4.6,
    author: 'AppDesigner',
    featured: false
  },
  {
    id: 59,
    title: 'Comic Panel Action Scene',
    description: 'Dynamic comic book panel with bold ink work and vibrant colors',
    prompt: 'Dynamic comic book panel, superhero in action pose mid-flight, bold black ink outlines, Ben-Day dots halftone pattern, vibrant primary colors, dramatic foreshortening, speed lines and impact effects, speech bubble space, Marvel/DC inspired art style, professional comic artist quality, Jim Lee meets Alex Ross, 4K --ar 2:3',
    category: 'Illustration',
    platform: 'Midjourney',
    tags: ['comic', 'superhero', 'action', 'illustration', 'dynamic'],
    likes: 1789,
    rating: 4.7,
    author: 'ComicArtPro',
    featured: false
  },
  {
    id: 60,
    title: 'Skateboarder Action Shot',
    description: 'Dynamic skateboarding trick capture with dramatic angle and lighting',
    prompt: 'Dynamic skateboarding action photography, skateboarder mid-kickflip at golden hour, shot from low angle, urban skatepark environment, motion blur on wheels, sharp focus on rider, dramatic backlighting creating silhouette edge, concrete textures, youth culture aesthetic, shot with Canon R5 at 1/2000s, 8K sports photography quality --ar 3:2',
    category: 'Cinematography',
    platform: 'Sora',
    tags: ['skateboard', 'action', 'sports', 'dynamic', 'urban'],
    likes: 1567,
    rating: 4.7,
    author: 'ActionShots',
    featured: false
  },
  {
    id: 61,
    title: 'City Skyline at Twilight',
    description: 'Stunning metropolitan skyline during blue hour with city lights emerging',
    prompt: 'Breathtaking city skyline at twilight blue hour, modern skyscrapers with lights turning on, gradient sky from deep blue to warm orange at horizon, reflections in river or harbor, long exposure light trails from traffic, panoramic composition, architectural photography masterpiece, shot from elevated viewpoint, 8K ultra resolution --ar 21:9',
    category: 'Architecture',
    platform: 'DALL-E',
    tags: ['city', 'skyline', 'twilight', 'urban', 'panoramic'],
    likes: 1678,
    rating: 4.7,
    author: 'CityScapePro',
    featured: false
  },
  {
    id: 62,
    title: 'Colorful Abstract Explosion',
    description: 'Vibrant abstract art with bold color splashes and dynamic energy',
    prompt: 'Explosive colorful abstract art, dynamic paint splashes and ink drops frozen in motion, vibrant rainbow palette against dark background, fluid dynamics simulation, high-speed photography aesthetic, swirling organic forms mixed with geometric elements, creative energy visualization, contemporary art gallery quality, 8K --ar 1:1',
    category: 'Abstract',
    platform: 'DALL-E',
    tags: ['abstract', 'colorful', 'explosion', 'vibrant', 'dynamic'],
    likes: 1456,
    rating: 4.7,
    author: 'AbstractFlow',
    featured: false
  },
  {
    id: 63,
    title: 'Vaporwave Aesthetic Scene',
    description: 'Retro-futuristic vaporwave artwork with pink/purple gradients and 80s nostalgia',
    prompt: 'Vaporwave aesthetic scene, retro-futuristic landscape with chrome palm trees, pink and purple gradient sky, wireframe grid ground extending to horizon, floating Greek statue busts, VHS glitch effects, retrowave sunset, neon pink sun, Japanese text overlays, 1980s nostalgia meets digital surrealism, lo-fi aesthetic, 4K --ar 16:9',
    category: 'Abstract',
    platform: 'Midjourney',
    tags: ['vaporwave', 'retro', 'aesthetic', '80s', 'synthwave'],
    likes: 2123,
    rating: 4.8,
    author: 'VaporDreams',
    featured: false
  },
  {
    id: 64,
    title: 'Soft Pastel Illustration',
    description: 'Gentle pastel-toned artwork with dreamy soft aesthetic and delicate details',
    prompt: 'Soft pastel illustration, dreamy scene with gentle color palette of lavender, mint, peach, and baby blue, delicate line work, cute character or landscape, cotton candy clouds, soft diffused lighting, cozy and calming atmosphere, children\'s book illustration quality, watercolor paper texture, soothing and gentle aesthetic, 4K --ar 4:5 --niji 5',
    category: 'Illustration',
    platform: 'Midjourney',
    tags: ['pastel', 'soft', 'dreamy', 'illustration', 'gentle'],
    likes: 1876,
    rating: 4.8,
    author: 'PastelDreams',
    featured: false
  }
];

const categories = ['All', 'Cinematography', 'Character', 'Abstract', 'Product', 'Nature', 'Architecture', 'Fantasy', 'Sci-Fi', 'Fashion', 'Illustration', 'Design'];
const platforms = ['All Platforms', 'Sora', 'Midjourney', 'Veo 3', 'DALL-E', 'Qwen.ai', 'NanoBanana', 'Stable Diffusion'];

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