'use client';

import { useState } from 'react';

const CATEGORIES = [
  'AI Prompts',
  'Prompt Engineering',
  'AI Tools',
  'AI News',
  'AI Tips & Tricks',
  'AI Tutorials',
];

interface GeneratedPost {
  id: string;
  title: string;
  category: string;
  excerpt?: string;
}

interface GenerationResult {
  success: boolean;
  message: string;
  data?: {
    postsCreated: number;
    posts: GeneratedPost[];
    errors: string[];
    generatedAt: string;
  };
  error?: string;
}

export default function BlogGeneratorPanel() {
  const [count, setCount] = useState(1);
  const [category, setCategory] = useState('');
  const [keywords, setKeywords] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenerationResult | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setResult(null);

    try {
      const body: any = { count };
      if (category) body.category = category;
      if (keywords.trim()) {
        body.keywords = keywords.split(',').map((k: string) => k.trim()).filter(Boolean);
      }

      const response = await fetch('/api/admin/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({
        success: false,
        message: 'Request failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border bg-card p-6 space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <span>📝</span> AI Blog Generator
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          Automatically generate SEO-optimized blog posts from latest AI news. 
          Posts are optimized for AI prompt keywords to improve search rankings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Post Count */}
        <div>
          <label className="block text-sm font-medium mb-1">Number of Posts</label>
          <select
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            disabled={loading}
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n} post{n > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">Category (optional)</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            disabled={loading}
          >
            <option value="">Auto-select</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Custom Keywords */}
        <div>
          <label className="block text-sm font-medium mb-1">Focus Keywords (optional)</label>
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="AI prompts, ChatGPT tips..."
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
            disabled={loading}
          />
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={loading}
        className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Generating...
          </>
        ) : (
          <>🚀 Generate Blog Posts</>
        )}
      </button>

      {/* Results */}
      {result && (
        <div className={`rounded-lg border p-4 ${result.success ? 'border-green-500/50 bg-green-500/10' : 'border-red-500/50 bg-red-500/10'}`}>
          <p className={`font-medium ${result.success ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {result.success ? '✅' : '❌'} {result.message || result.error}
          </p>

          {result.data?.posts && result.data.posts.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-sm font-medium">Created Posts:</p>
              {result.data.posts.map((post) => (
                <div key={post.id} className="flex items-center gap-2 text-sm">
                  <span className="text-green-500">•</span>
                  <a 
                    href={`/blog/${post.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline text-primary"
                  >
                    {post.title}
                  </a>
                  <span className="text-muted-foreground">({post.category})</span>
                </div>
              ))}
            </div>
          )}

          {result.data?.errors && result.data.errors.length > 0 && (
            <div className="mt-3 space-y-1">
              <p className="text-sm font-medium text-red-600 dark:text-red-400">Errors:</p>
              {result.data.errors.map((err, i) => (
                <p key={i} className="text-sm text-red-500">{err}</p>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Schedule Info */}
      <div className="rounded-lg border border-dashed p-4 bg-muted/30">
        <p className="text-sm font-medium mb-2">⏰ Automated Schedule</p>
        <p className="text-xs text-muted-foreground">
          Daily at 8:00 AM UTC — 2 posts auto-generated from latest AI news, 
          optimized for AI prompt keywords. Configure in <code className="bg-muted px-1 rounded">vercel.json</code>.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Cron endpoint: <code className="bg-muted px-1 rounded">GET /api/cron/generate-blog?count=2</code>
        </p>
      </div>
    </div>
  );
}
