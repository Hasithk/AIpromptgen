import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Zap, Target, Users, Rocket, Mail, Globe } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'About Us',
  description: 'Learn about AI Prompt Generator and our mission to empower creators with advanced AI tools.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-500/20 text-purple-300 border-purple-500/30">
            About Us
          </Badge>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Empowering Creators with AI
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            AI Prompt Generator is your ultimate platform for creating professional-grade AI prompts for Sora, Midjourney, DALL-E, Veo 3, Qwen.ai, and more.
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Our Mission</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                To democratize AI-powered content creation by providing intuitive, powerful tools that help creators, designers, and professionals generate stunning prompts effortlessly. We believe in making advanced AI technology accessible to everyone.
              </p>
            </CardContent>
          </Card>

          <Card className="glass-card border-white/10">
            <CardHeader>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Our Vision</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-300 leading-relaxed">
                To become the world's leading AI prompt engineering platform, continuously innovating and expanding our capabilities to support emerging AI technologies and empower the next generation of digital creators.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <Card className="glass-card border-white/10 mb-16">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              What We Offer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <Zap className="h-10 w-10 text-blue-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">AI-Powered Generation</h3>
                <p className="text-gray-400">
                  Advanced AI algorithms create professional prompts optimized for all major AI platforms.
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <Users className="h-10 w-10 text-purple-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Curated Library</h3>
                <p className="text-gray-400">
                  Access 30+ world-class trending prompts, updated daily with new creative content.
                </p>
              </div>

              <div className="p-6 bg-white/5 rounded-lg border border-white/10">
                <Globe className="h-10 w-10 text-pink-400 mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Multi-Platform Support</h3>
                <p className="text-gray-400">
                  Compatible with Sora, Midjourney, DALL-E, Veo 3, Qwen.ai, and other AI platforms.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Developer Section */}
        <Card className="glass-card border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              Developed By
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-3 mb-6 p-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl border border-blue-500/30">
                <div className="p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                  <Globe className="h-8 w-8 text-white" />
                </div>
                <div className="text-left">
                  <h2 className="text-3xl font-bold text-white">LookInternational</h2>
                  <p className="text-gray-400">Innovative Digital Solutions</p>
                </div>
              </div>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                LookInternational is a leading technology company specializing in AI-powered solutions and innovative web applications. We're passionate about creating tools that empower creators and businesses worldwide.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="mailto:lookinternationallk@gmail.com"
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition-all"
                >
                  <Mail className="h-5 w-5" />
                  lookinternationallk@gmail.com
                </Link>
                <Link 
                  href="/contact"
                  className="px-6 py-3 bg-white/10 text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all"
                >
                  Contact Us
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid md:grid-cols-4 gap-6 mt-16">
          <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
              10K+
            </div>
            <div className="text-gray-400">Active Users</div>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent mb-2">
              100K+
            </div>
            <div className="text-gray-400">Prompts Generated</div>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-pink-400 to-red-400 bg-clip-text text-transparent mb-2">
              30+
            </div>
            <div className="text-gray-400">Trending Prompts</div>
          </div>
          <div className="text-center p-6 bg-white/5 rounded-lg border border-white/10">
            <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">
              5+
            </div>
            <div className="text-gray-400">AI Platforms</div>
          </div>
        </div>
      </div>
    </div>
  );
}
