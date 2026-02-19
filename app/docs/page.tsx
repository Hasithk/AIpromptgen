import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Code, Lightbulb, Rocket, FileText, Video } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'AI Prompt Generator Documentation | How to Use AI Prompt Tool',
  description: 'Complete documentation for AI Prompt Generator. Learn how to create professional AI prompts for ChatGPT, Midjourney, DALL-E, Sora. API docs, tutorials, and AI prompt best practices.',
  keywords: 'ai prompt generator docs, ai prompt documentation, how to use ai prompt generator, ai prompt api, prompt engineering docs',
  alternates: {
    canonical: 'https://www.aipromptgen.app/docs',
  },
  openGraph: {
    title: 'AI Prompt Generator Documentation',
    description: 'Complete guide to using the best free AI prompt generator.',
    url: 'https://www.aipromptgen.app/docs',
  },
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            Documentation
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            AI Prompt Generator Docs
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Everything you need to know about creating professional AI prompts for Sora, Midjourney, DALL-E, Veo 3, and more.
          </p>
        </div>

        {/* Documentation Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="glass-card border-white/10 hover:border-purple-500/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Getting Started</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Learn the basics of AI prompt generation and how to use our platform effectively.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Quick start guide</li>
                <li>• Understanding AI models</li>
                <li>• Basic prompt structure</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-purple-500/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Video className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Video Prompts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Master video generation with Sora, Veo 3, and other AI video tools.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Sora prompt examples</li>
                <li>• Veo 3 best practices</li>
                <li>• Camera movements</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-purple-500/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-pink-500 to-orange-600 rounded-lg">
                  <FileText className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Image Prompts</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Create stunning images with Midjourney, DALL-E, and Stable Diffusion.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Midjourney parameters</li>
                <li>• DALL-E 3 techniques</li>
                <li>• Style references</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-purple-500/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-green-500 to-teal-600 rounded-lg">
                  <Code className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Advanced Techniques</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Advanced prompt engineering and optimization strategies.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Negative prompts</li>
                <li>• Weight parameters</li>
                <li>• Multi-model workflows</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-purple-500/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-lg">
                  <Lightbulb className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Best Practices</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Tips and tricks from professional AI artists and creators.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Quality guidelines</li>
                <li>• Common mistakes</li>
                <li>• Pro tips</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10 hover:border-purple-500/50 transition-all">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-xl text-white">Prompt Library</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 mb-4">
                Access our extensive collection of pre-made prompts and templates.
              </p>
              <ul className="space-y-2 text-gray-400">
                <li>• Browse templates</li>
                <li>• Save favorites</li>
                <li>• Community prompts</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Quick Links */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-2xl text-white">Popular Topics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">AI Models</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• OpenAI Sora</li>
                  <li>• Midjourney v6</li>
                  <li>• DALL-E 3</li>
                  <li>• Google Veo 3</li>
                  <li>• Stable Diffusion XL</li>
                  <li>• Qwen AI</li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-3">Use Cases</h3>
                <ul className="space-y-2 text-gray-300">
                  <li>• Marketing & Advertising</li>
                  <li>• Social Media Content</li>
                  <li>• Product Visualization</li>
                  <li>• Storytelling & Animation</li>
                  <li>• Art & Design</li>
                  <li>• Educational Content</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <Card className="glass-card border-white/10 bg-gradient-to-r from-purple-500/10 to-pink-500/10">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold text-white mb-4">
                Ready to Create Amazing AI Prompts?
              </h2>
              <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
                Start generating professional prompts for free. Get 100 monthly credits with no credit card required.
              </p>
              <Link
                href="/"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105"
              >
                Start Generating
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
