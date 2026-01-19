import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Video, Image, Sparkles, Zap, TrendingUp } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'AI Prompt Guides - Learn Prompt Engineering',
  description: 'Comprehensive guides for creating AI prompts for Sora, Midjourney, DALL-E, Veo 3, and more. Learn prompt engineering best practices.',
  openGraph: {
    title: 'AI Prompt Guides - AI Prompt Generator',
    description: 'Master prompt engineering with our comprehensive guides',
    url: 'https://aipromptgen.app/guides',
  },
};

export default function GuidesPage() {
  const guides = [
    {
      title: 'Complete Guide to Sora Prompts',
      description: 'Master OpenAI\'s Sora video generation with detailed examples and best practices.',
      icon: Video,
      category: 'Video Generation',
      level: 'Beginner to Advanced',
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Midjourney Mastery Guide',
      description: 'Learn all Midjourney parameters, styles, and techniques for creating stunning images.',
      icon: Image,
      category: 'Image Generation',
      level: 'All Levels',
      color: 'from-purple-500 to-pink-600',
    },
    {
      title: 'DALL-E 3 Prompt Engineering',
      description: 'Unlock the full potential of DALL-E 3 with advanced prompting techniques.',
      icon: Sparkles,
      category: 'Image Generation',
      level: 'Intermediate',
      color: 'from-green-500 to-teal-600',
    },
    {
      title: 'Veo 3 Video Prompts',
      description: 'Create cinematic videos with Google\'s Veo 3 using professional prompt strategies.',
      icon: Video,
      category: 'Video Generation',
      level: 'Beginner',
      color: 'from-orange-500 to-red-600',
    },
    {
      title: 'Prompt Optimization Strategies',
      description: 'Learn how to refine and optimize your prompts for better AI outputs.',
      icon: Zap,
      category: 'Advanced Techniques',
      level: 'Advanced',
      color: 'from-yellow-500 to-orange-600',
    },
    {
      title: 'AI Model Comparison Guide',
      description: 'Understand the differences between AI models and when to use each one.',
      icon: TrendingUp,
      category: 'General',
      level: 'Beginner',
      color: 'from-indigo-500 to-purple-600',
    },
  ];

  const quickTips = [
    {
      title: 'Be Specific',
      description: 'The more detailed your prompt, the better the AI understands your vision.',
    },
    {
      title: 'Use Descriptive Language',
      description: 'Include adjectives, lighting conditions, camera angles, and mood descriptions.',
    },
    {
      title: 'Experiment with Styles',
      description: 'Reference art styles, photography techniques, or famous artists for unique results.',
    },
    {
      title: 'Iterate and Refine',
      description: 'Don\'t expect perfection on the first try. Refine your prompts based on results.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            Learning Center
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Prompt Engineering Guides
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Learn how to create professional AI prompts from beginner basics to advanced techniques. 
            Master Sora, Midjourney, DALL-E, Veo 3, and more.
          </p>
        </div>

        {/* Guides Grid */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-white mb-8 text-center">Featured Guides</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {guides.map((guide, index) => (
              <Card key={index} className="glass-card border-white/10 hover:border-purple-500/50 transition-all group">
                <CardHeader>
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 bg-gradient-to-br ${guide.color} rounded-lg group-hover:scale-110 transition-transform`}>
                      <guide.icon className="h-6 w-6 text-white" />
                    </div>
                    <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">
                      {guide.level}
                    </Badge>
                  </div>
                  <CardTitle className="text-xl text-white mb-2">{guide.title}</CardTitle>
                  <Badge className="bg-blue-500/20 text-blue-300 border-blue-500/30 w-fit">
                    {guide.category}
                  </Badge>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 mb-4">{guide.description}</p>
                  <Link 
                    href="/blog"
                    className="text-purple-400 hover:text-purple-300 font-medium inline-flex items-center"
                  >
                    Read Guide →
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Tips Section */}
        <Card className="glass-card border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-white flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-purple-400" />
              Quick Prompt Writing Tips
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {quickTips.map((tip, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2">{tip.title}</h3>
                    <p className="text-gray-300">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Popular Topics */}
        <Card className="glass-card border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Browse by Topic</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Video AI</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Sora video prompts</li>
                  <li>• Veo 3 techniques</li>
                  <li>• Camera movements</li>
                  <li>• Scene transitions</li>
                  <li>• Cinematic lighting</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Image AI</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Midjourney parameters</li>
                  <li>• DALL-E best practices</li>
                  <li>• Style references</li>
                  <li>• Aspect ratios</li>
                  <li>• Quality settings</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Advanced</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Negative prompts</li>
                  <li>• Weight parameters</li>
                  <li>• Multi-prompting</li>
                  <li>• Seed control</li>
                  <li>• Batch processing</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Prompt Structure Guide */}
        <Card className="glass-card border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Anatomy of a Great Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-gray-300">
              <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">1. Subject</h4>
                <p>What is the main focus? (person, object, scene)</p>
              </div>
              <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">2. Description</h4>
                <p>Details, attributes, colors, textures, emotions</p>
              </div>
              <div className="p-4 bg-pink-500/10 border border-pink-500/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">3. Environment</h4>
                <p>Setting, background, location, time of day</p>
              </div>
              <div className="p-4 bg-orange-500/10 border border-orange-500/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">4. Style</h4>
                <p>Art style, photography type, rendering technique</p>
              </div>
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                <h4 className="font-semibold text-white mb-2">5. Technical</h4>
                <p>Camera angle, lighting, quality, parameters</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="text-center">
          <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Put Your Knowledge into Practice?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Start creating professional AI prompts using what you've learned. Get 100 free credits monthly.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/"
                  className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
                >
                  Start Generating Prompts
                </Link>
                <Link
                  href="/blog"
                  className="inline-block bg-white/10 text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/20 transition-all border border-white/20"
                >
                  Read More Guides
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
