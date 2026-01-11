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
    question: "How to generate a prompt for AI?",
    answer: "To generate an effective AI prompt: 1) Be specific and detailed in your description, 2) Include technical parameters (resolution, style, lighting for images), 3) Specify the desired output format, 4) Use our free AI Prompt Generator which automatically optimizes your ideas into professional prompts with 70 free generations monthly.",
    link: "/"
  },
  {
    question: "What is the best AI prompt generator?",
    answer: "The best AI prompt generator in 2026 is AIPromptGen.app, offering 70 free monthly generations, support for all major AI platforms (ChatGPT, Midjourney, DALL-E, Sora), and intelligent prompt optimization. It works for text, image, and video generation with proven templates and real-time refinement.",
    link: "/"
  },
  {
    question: "Where can I find free AI prompts?",
    answer: "Free AI prompts are available at: 1) AIPromptGen.app Library (curated collection of proven prompts), 2) Our daily AI blog with prompt examples, 3) Community platforms like Reddit and Discord, 4) GitHub repositories with open-source prompts. Start with our 70 free monthly credits to generate custom prompts.",
    link: "/library"
  },
  {
    question: "Which AI is better than ChatGPT?",
    answer: "While ChatGPT leads in general-purpose tasks, alternatives excel in specific areas: Claude (complex analysis & long-form content), Google Gemini (multimodal understanding & image analysis), DeepSeek (cost-effective coding), and Llama 3 (open-source flexibility). Choose based on your specific needs - our prompt generator works with all platforms.",
    link: "/blog/jan-12-2026"
  },
  {
    question: "How do I use an AI prompt generator for images?",
    answer: "For image generation: 1) Select your AI platform (Midjourney, DALL-E, Stable Diffusion), 2) Describe your desired image with specific details (subject, style, lighting, composition), 3) Add technical parameters (resolution, aspect ratio, quality tags), 4) Use our generator to automatically optimize and enhance your description. Works for portraits, landscapes, products, and digital art.",
    link: "/blog/jan-09-2026"
  },
  {
    question: "What are AI prompt examples for different use cases?",
    answer: "Common AI prompt examples: Image: 'Ultra-realistic portrait, cinematic lighting, 8K detail'; Video: 'Drone shot of futuristic city, golden hour, slow pan'; Text: 'Write a technical guide, professional tone, include statistics'; ChatGPT: 'Act as an expert copywriter, create engaging headlines'. Browse our blog for hundreds of proven examples.",
    link: "/blog"
  },
  {
    question: "Can I generate prompts from existing images?",
    answer: "Yes! Image-to-prompt tools analyze existing images and generate text descriptions. Upload a reference image to tools like CLIP Interrogator or Midjourney's /describe command. This helps you: recreate styles, learn from successful prompts, and improve your prompt writing skills. Perfect for maintaining consistent visual styles across projects.",
    link: "/blog/jan-09-2026"
  },
  {
    question: "How much does an AI prompt generator cost?",
    answer: "AIPromptGen.app offers 70 FREE generations monthly, perfect for regular users. Our Pro plan ($19/month) includes unlimited generations, priority support, and advanced features. Premium ($49/month) adds team collaboration and API access. Unlike other tools charging $50-100/month, we keep AI prompts accessible to everyone.",
    link: "/pricing"
  },
  {
    question: "What's the difference between text, image, and video prompts?",
    answer: "Text prompts focus on content, tone, and structure. Image prompts emphasize visual elements (lighting, composition, style, technical specs). Video prompts add temporal elements (movement, transitions, duration, camera angles). Our generator automatically adapts to your chosen AI platform and output type, optimizing each prompt format accordingly.",
    link: "/"
  },
  {
    question: "How do I write better AI prompts?",
    answer: "Pro tips for better prompts: 1) Be specific and detailed, 2) Use technical terminology, 3) Reference established styles (e.g., 'cinematic', 'professional photography'), 4) Include quality parameters (8K, ultra detailed), 5) Test multiple variations, 6) Use negative prompts to exclude unwanted elements. Our AI generator handles this optimization automatically.",
    link: "/blog/jan-12-2026"
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
            Frequently Asked Questions
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Everything you need to know about AI prompt generators and how to create stunning AI content
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
