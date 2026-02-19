'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface FAQ {
  question: string;
  answer: string;
  link?: string;
}

const faqs: FAQ[] = [
  {
    question: "What is an AI prompt and how does it work?",
    answer: "An AI prompt is the text instruction you give to an artificial intelligence model (like ChatGPT, Midjourney, DALL-E, or Sora) to generate desired output. A well-crafted AI prompt includes specific details about subject, style, format, and parameters. Our free AI prompt generator automatically creates optimized AI prompts for any platform with 70 free generations monthly.",
    link: "/"
  },
  {
    question: "What is the best AI prompt generator in 2026?",
    answer: "AIPromptGen.app is the best AI prompt generator in 2026, offering 70 free monthly AI prompt generations, support for all major AI platforms (ChatGPT, Midjourney, DALL-E, Sora, Claude, Gemini), a curated AI prompt library with 500+ templates, and intelligent prompt optimization. It's the most comprehensive free AI prompt tool available.",
    link: "/"
  },
  {
    question: "How do I write a good AI prompt?",
    answer: "To write an effective AI prompt: 1) Be specific and detailed in your description, 2) Include technical parameters (resolution, style, lighting for image AI prompts), 3) Specify the desired output format, 4) Use role-based prompting for ChatGPT AI prompts, 5) Add negative prompts to exclude unwanted elements. Or simply use our free AI prompt generator which handles all optimization automatically.",
    link: "/"
  },
  {
    question: "Is this AI prompt generator really free?",
    answer: "Yes! AIPromptGen.app offers 70 completely free AI prompt generations per month with no credit card required. You can generate AI prompts for ChatGPT, Midjourney, DALL-E, Sora, Claude, Gemini, and Stable Diffusion for free. Pro plans are available for unlimited AI prompt generation starting at $19/month.",
    link: "/pricing"
  },
  {
    question: "Where can I find free AI prompt templates and examples?",
    answer: "Free AI prompt templates are available at: 1) AIPromptGen.app Prompt Library (500+ curated AI prompt templates), 2) Our daily AI prompt blog with examples and tutorials, 3) Our AI prompt guides with step-by-step instructions. Start with our 70 free monthly credits to generate custom AI prompts instantly.",
    link: "/library"
  },
  {
    question: "How to use AI prompt generator for image creation?",
    answer: "For image AI prompts: 1) Select your platform (Midjourney, DALL-E, Stable Diffusion), 2) Describe your desired image with specific details about subject, style, lighting, and composition, 3) Add technical parameters like resolution and aspect ratio, 4) Use our AI prompt generator to automatically optimize your prompt with platform-specific parameters. Works for portraits, landscapes, products, fantasy art, and more.",
    link: "/guides"
  },
  {
    question: "What AI prompt examples work best for ChatGPT?",
    answer: "The best ChatGPT AI prompt examples use role-based prompting: 'You are an expert [role] with [years] experience. [Task]. Format: [output structure]. Tone: [style]. Include: [specific requirements].' Our AI prompt generator creates optimized ChatGPT prompts automatically with proven templates for writing, coding, marketing, analysis, and more.",
    link: "/blog"
  },
  {
    question: "Can I generate AI video prompts for Sora?",
    answer: "Yes! Our AI prompt generator creates optimized video prompts for Sora, including camera movements, scene descriptions, timing, cinematic styles, and technical parameters. AI video prompts should include: scene description, camera movement, visual style, action/motion details, and duration. Generate free Sora AI prompts at AIPromptGen.app.",
    link: "/"
  },
  {
    question: "How much does an AI prompt generator cost?",
    answer: "AIPromptGen.app is completely free to start with 70 AI prompt generations per month. For power users, our Pro plan ($19/month) includes unlimited AI prompt generations, priority support, and advanced features. Premium ($49/month) adds team collaboration and API access. We offer the best value for any AI prompt tool.",
    link: "/pricing"
  },
  {
    question: "What platforms does this AI prompt generator support?",
    answer: "Our AI prompt generator supports all major AI platforms: ChatGPT (GPT-4, GPT-5), Midjourney (V6, V7), DALL-E (3, 4), Sora (video), Claude (Anthropic), Gemini (Google), Stable Diffusion, DeepSeek, Llama, and more. Each AI prompt is automatically optimized for the selected platform's specific requirements and parameters.",
    link: "/docs"
  }
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="section-padding py-16 bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <div className="container-max">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400">
            AI Prompt Generator FAQ
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about AI prompts, our free AI prompt generator, and how to create the best AI prompts for any platform
          </p>
        </div>

        {/* FAQ Grid */}
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-gray-800/50 rounded-lg border border-gray-700 hover:border-blue-500/50 transition-all duration-300 overflow-hidden"
            >
              {/* Question Button */}
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-800/70 transition-colors"
                aria-expanded={openIndex === index}
              >
                <h3 className="text-lg font-semibold text-white pr-4">
                  {faq.question}
                </h3>
                <div className="flex-shrink-0">
                  {openIndex === index ? (
                    <ChevronUp className="w-5 h-5 text-blue-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </button>

              {/* Answer */}
              {openIndex === index && (
                <div className="px-6 pb-5 pt-2">
                  <p className="text-gray-300 leading-relaxed mb-4">
                    {faq.answer}
                  </p>
                  {faq.link && (
                    <Link
                      href={faq.link}
                      className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors font-medium"
                    >
                      Learn more →
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-6">
            Still have questions? Try our free AI prompt generator now!
          </p>
          <Link
            href="/"
            className="inline-block px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
          >
            Generate Free Prompts
          </Link>
        </div>

        {/* Schema Markup for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": faqs.map(faq => ({
                "@type": "Question",
                "name": faq.question,
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": faq.answer
                }
              }))
            })
          }}
        />
      </div>
    </section>
  );
}
