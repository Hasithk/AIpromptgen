'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Wand2, Copy, Download, Heart, Sparkles, LogIn } from 'lucide-react';
import { usePromptGenerator } from '@/hooks/use-prompt-generator';
import { useCredits } from '@/hooks/use-credits';
import { updateUserCredits } from '@/lib/api';
import { PLATFORMS, STYLES, MOODS, LIGHTING_OPTIONS } from '@/lib/constants';


export function PromptGenerator() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedPlatform, setSelectedPlatform] = useState('sora');
  const [subject, setSubject] = useState('');
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedLighting, setSelectedLighting] = useState('');
  const [creativity, setCreativity] = useState([75]);
  const [duration, setDuration] = useState([30]);
  const [includeNegative, setIncludeNegative] = useState(true);
  const [manualPrompt, setManualPrompt] = useState('');
  const [promptType, setPromptType] = useState<'image' | 'video'>('video');
  const [advancedPlatform, setAdvancedPlatform] = useState(PLATFORMS[0].value);

  const { generate, isGenerating, generatedPrompt, error } = usePromptGenerator();
  const { credits, updateCredits } = useCredits();

  const isAuthenticated = status === 'authenticated';

  // Filter platforms based on prompt type
  const availablePlatforms = PLATFORMS.filter(p => p.type === promptType);

  // Update selected platform when prompt type changes
  useEffect(() => {
    const currentPlatformType = PLATFORMS.find(p => p.value === selectedPlatform)?.type;
    if (currentPlatformType !== promptType) {
      // Set default platform for the new type
      const defaultPlatform = availablePlatforms[0];
      if (defaultPlatform) {
        setSelectedPlatform(defaultPlatform.value);
      }
    }
  }, [promptType, selectedPlatform, availablePlatforms]);

  const handleStyleToggle = (style: string) => {
    setSelectedStyles(prev =>
      prev.includes(style)
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const generatePrompt = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    // Determine credits to use
    const creditsToUse = selectedPlatform === 'sora' ? 5 : 3;
    if (credits < creditsToUse) {
      alert('Insufficient credits!');
      return;
    }
    await generate({
      subject,
      platform: selectedPlatform,
      styles: selectedStyles,
      mood: selectedMood,
      lighting: selectedLighting,
      creativity: creativity[0],
      duration: duration[0],
      includeNegative,
      type: promptType,
    });
    // Reduce credits after successful generation
    const res = await updateUserCredits(creditsToUse);
    if (res.success && res.data) {
      updateCredits(res.data.credits);
    }
  };

  const handleOptimizePrompt = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      router.push('/auth/signin');
      return;
    }

    if (!manualPrompt) return;
    const creditsToUse = advancedPlatform === 'sora' ? 5 : 3;
    if (credits < creditsToUse) {
      alert('Insufficient credits!');
      return;
    }
    await generate({
      subject: manualPrompt,
      platform: advancedPlatform,
      styles: [],
      mood: '',
      lighting: '',
      creativity: 75,
      duration: 30,
      includeNegative: false,
      type: promptType,
    });
    const res = await updateUserCredits(creditsToUse);
    if (res.success && res.data) {
      updateCredits(res.data.credits);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold gradient-text">
                AI Prompt Generator
              </CardTitle>
              <CardDescription className="text-base mt-2">
                Create professional prompts with our advanced guided builder
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Pro Features
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-8">
          <Tabs defaultValue="builder" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="builder">Guided Builder</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>
            
            <TabsContent value="builder" className="space-y-6 mt-6">
              {/* Prompt Type Toggle */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Prompt Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={promptType === 'image' ? 'default' : 'outline'}
                    onClick={() => setPromptType('image')}
                  >
                    Image
                  </Button>
                  <Button
                    variant={promptType === 'video' ? 'default' : 'outline'}
                    onClick={() => setPromptType('video')}
                  >
                    Video
                  </Button>
                </div>
              </div>
              {/* Platform Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Platform</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {availablePlatforms.map((platform) => (
                    <Card 
                      key={platform.value} 
                      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                        selectedPlatform === platform.value 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:bg-muted/50'
                      }`}
                      onClick={() => setSelectedPlatform(platform.value)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{platform.label}</h4>
                            <p className="text-sm text-muted-foreground">
                              {platform.description}
                            </p>
                          </div>
                          {selectedPlatform === platform.value && (
                            <div className="w-3 h-3 bg-primary rounded-full" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Subject Input */}
              <div className="space-y-3">
                <Label htmlFor="subject" className="text-base font-semibold">
                  Subject/Scene
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., A futuristic cityscape at sunset..."
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="text-base"
                />
              </div>

              {/* Style Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">
                  Visual Styles ({selectedStyles.length} selected)
                </Label>
                <div className="flex flex-wrap gap-2">
                  {STYLES.map((style) => (
                    <Button
                      key={style}
                      variant={selectedStyles.includes(style) ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleStyleToggle(style)}
                      className={selectedStyles.includes(style) ? "bg-primary" : ""}
                    >
                      {style}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Mood & Lighting */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Mood</Label>
                  <Select value={selectedMood} onValueChange={setSelectedMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOODS.map((mood) => (
                        <SelectItem key={mood} value={mood}>
                          {mood}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label className="text-base font-semibold">Lighting</Label>
                  <Select value={selectedLighting} onValueChange={setSelectedLighting}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select lighting" />
                    </SelectTrigger>
                    <SelectContent>
                      {LIGHTING_OPTIONS.map((lighting) => (
                        <SelectItem key={lighting} value={lighting}>
                          {lighting}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Creativity & Duration Sliders */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">
                    Creativity Level: {creativity[0]}%
                  </Label>
                  <Slider
                    value={creativity}
                    onValueChange={setCreativity}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                {selectedPlatform === 'sora' && (
                  <div className="space-y-3">
                    <Label className="text-base font-semibold">
                      Duration: {duration[0]}s
                    </Label>
                    <Slider
                      value={duration}
                      onValueChange={setDuration}
                      max={60}
                      min={5}
                      step={5}
                      className="w-full"
                    />
                  </div>
                )}
              </div>

              {/* Advanced Options */}
              <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Include Negative Prompts</Label>
                    <p className="text-sm text-muted-foreground">
                      Add suggestions for what to avoid
                    </p>
                  </div>
                  <Switch
                    checked={includeNegative}
                    onCheckedChange={setIncludeNegative}
                  />
                </div>
              </div>

              {/* Generate Button */}
              {!isAuthenticated ? (
                <Button 
                  onClick={() => router.push('/auth/signin')}
                  className="w-full btn-primary py-6 text-lg font-semibold"
                  size="lg"
                >
                  <LogIn className="mr-2 h-5 w-5" />
                  Sign In to Generate
                </Button>
              ) : (
                <Button 
                  onClick={generatePrompt}
                  disabled={!subject || isGenerating}
                  className="w-full btn-primary py-6 text-lg font-semibold group"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin h-5 w-5 mr-2 border-2 border-white/20 border-t-white rounded-full" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="mr-2 h-5 w-5 group-hover:rotate-12 transition-transform" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              )}
            </TabsContent>
            
            <TabsContent value="advanced" className="space-y-6 mt-6">
              {/* Platform Selection for Advanced */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Platform</Label>
                <Select value={advancedPlatform} onValueChange={setAdvancedPlatform}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select platform" />
                  </SelectTrigger>
                  <SelectContent>
                    {availablePlatforms.map((platform) => (
                      <SelectItem key={platform.value} value={platform.value}>
                        {platform.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* Prompt Type Toggle for Advanced */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Prompt Type</Label>
                <div className="flex gap-2">
                  <Button
                    variant={promptType === 'image' ? 'default' : 'outline'}
                    onClick={() => setPromptType('image')}
                  >
                    Image
                  </Button>
                  <Button
                    variant={promptType === 'video' ? 'default' : 'outline'}
                    onClick={() => setPromptType('video')}
                  >
                    Video
                  </Button>
                </div>
              </div>
              <div className="space-y-4">
                <Label htmlFor="manual-prompt" className="text-base font-semibold">
                  Manual Prompt Input
                </Label>
                <Textarea
                  id="manual-prompt"
                  placeholder="Enter your prompt manually for fine-tuning..."
                  rows={6}
                  className="text-base"
                  value={manualPrompt}
                  onChange={e => setManualPrompt(e.target.value)}
                />
                {!isAuthenticated ? (
                  <Button 
                    onClick={() => router.push('/auth/signin')}
                    className="w-full btn-primary"
                  >
                    <LogIn className="mr-2 h-4 w-4" />
                    Sign In to Optimize
                  </Button>
                ) : (
                  <Button className="w-full btn-primary" onClick={handleOptimizePrompt} disabled={!manualPrompt || isGenerating}>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Optimize Prompt
                  </Button>
                )}
              </div>
            </TabsContent>
          </Tabs>

          {/* Generated Prompt */}
          {generatedPrompt && (
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-primary" />
                  Generated Prompt
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-white dark:bg-gray-800 rounded-lg border">
                  <p className="text-base leading-relaxed">{generatedPrompt}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm">
                    <Heart className="mr-2 h-4 w-4" />
                    Save
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
          
          {/* Error Display */}
          {error && (
            <Card className="border-destructive/20 bg-destructive/5">
              <CardContent className="p-4">
                <p className="text-destructive text-sm">{error}</p>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
}