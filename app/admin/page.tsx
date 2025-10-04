import { BlogAutomationControl } from '@/components/blog-automation-control';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Zap, Calendar, TrendingUp } from 'lucide-react';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage blog automation and content generation
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Blog Automation
              </CardTitle>
              <Zap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">
                Generates posts every 3 days
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                AI Integration
              </CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">DeepSeek AI</div>
              <p className="text-xs text-muted-foreground">
                Content generation ready
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                News Source
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">NewsAPI</div>
              <p className="text-xs text-muted-foreground">
                Real-time AI news feed
              </p>
            </CardContent>
          </Card>
        </div>

        <BlogAutomationControl />

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Automation Features</span>
            </CardTitle>
            <CardDescription>
              How the blog automation system works
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-semibold">Content Generation</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Fetches latest AI news from NewsAPI</li>
                  <li>• Uses DeepSeek AI for content creation</li>
                  <li>• Generates 800-1200 word articles</li>
                  <li>• Includes SEO-optimized titles and excerpts</li>
                </ul>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-semibold">Automation Schedule</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Runs every 3 days automatically</li>
                  <li>• Can be triggered manually anytime</li>
                  <li>• Tracks generation history</li>
                  <li>• Fallback content if APIs fail</li>
                </ul>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-2">API Keys Required</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                <div className="flex justify-between">
                  <span>DEEPSEEK_API_KEY:</span>
                  <span className="text-green-600">✓ Configured</span>
                </div>
                <div className="flex justify-between">
                  <span>NEWS_API_KEY:</span>
                  <span className="text-green-600">✓ Configured</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}