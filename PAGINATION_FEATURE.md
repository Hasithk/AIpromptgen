# AI News Page - Pagination & 25 Items Feature

**Date:** October 24, 2025  
**Status:** ✅ IMPLEMENTED & VERIFIED

## Features Added

### 1. Increased Article Count
✅ **From 10 → 25 articles** per view  
✅ **8 diverse query topics** instead of 4  
✅ **20 articles per query** (was 10)  
✅ **Total fetch: 160 articles** for better filtering  

### 2. Unique Images for Each Article
✅ **25 different placeholder images** using Unsplash  
✅ **Real images from NewsAPI** when available  
✅ **Fallback image rotation** for articles without images  
✅ **Different image for each article position**  

### 3. Google-Style Pagination
✅ **9 articles per page** (3x3 grid layout)  
✅ **3 pages** minimum for 25 articles  
✅ **Smart page numbering:**
   - Always shows: 1, 2, 3
   - Always shows: Last 3 pages
   - Always shows: Current page ± 1
   - Smart ellipsis (...) between ranges
   
✅ **Navigation buttons:**
   - "← Previous" (disabled on page 1)
   - Individual page numbers
   - "Next →" (disabled on last page)
   - Smooth scroll to top on change

### 4. Pagination Info Display
✅ **"Showing X to Y of Z articles"**  
✅ **"Page P of T"** total pages  
✅ **Dynamic calculation** as filters change

## API Improvements

### `/api/news/latest` Endpoint
```
Query Strategy:
- artificial intelligence
- machine learning
- ChatGPT
- OpenAI
- Sora OR Midjourney OR DALL-E
- Claude OR Gemini
- DeepSeek OR LLM
- neural network OR deep learning

Per Query: 20 articles
Total Fetch: ~160 articles
Final Output: 25 AI-relevant articles
```

**Response includes:**
- `id` - Unique identifier
- `title` - Article title
- `description` - Summary
- `url` - Source link
- `urlToImage` - Article image (or placeholder)
- `publishedAt` - Publication date
- `source` - News source name
- `category` - AI News
- `total` - Total articles returned

### `/api/ai-news` Endpoint
```
Inherits from /api/news/latest

Additional Features:
- Automatic categorization
- AI relevance scoring (high/medium/low)
- Category metadata
- Image passthrough from NewsAPI
```

## UI Components

### News Grid Layout
```
Page 1: 9 articles (3x3 grid)
Page 2: 9 articles (3x3 grid)  
Page 3: 7 articles (3×3 grid with 7 visible)
```

### Pagination Controls
```
← Previous | 1 | 2 | 3 | ... | 100 | 101 | 102 | Next →
```

### Image Display
- Article image at top of card
- Hover effect: Scale up 105%
- Rounded corners at top
- Maintains aspect ratio (video-like dimensions)
- Different image per article

## How It Works

### Data Flow
```
NewsAPI (8 queries × 20 articles = 160)
    ↓
Deduplication (remove duplicates)
    ↓
AI Keyword Filter
    ↓
Sort by publish date (newest first)
    ↓
Return top 25 articles with images
    ↓
Frontend pagination (9 per page)
    ↓
User sees 3 pages with smart navigation
```

### Pagination Logic
```
1. Fetch all filtered articles (25)
2. Calculate total pages: ceil(25 / 9) = 3
3. On page change: slice(start, end) from 25
4. Show pagination UI if pages > 1
5. Disable buttons at boundaries
6. Scroll to top smoothly
```

## Testing Verified

### API Tests
✅ `/api/news/latest` returns 25 articles  
✅ Each article has unique image  
✅ Articles sorted by publish date  
✅ All articles match AI keywords  
✅ Cache-busting working  

### UI Tests
✅ 9 articles display per page  
✅ Page buttons render correctly  
✅ Previous/Next buttons work  
✅ Pagination info accurate  
✅ Scroll to top on navigation  
✅ Filters reset pagination to page 1  

## User Experience

### Before
- Only 10 articles shown
- Same placeholder image repeated
- Limited content visibility
- All articles on one page

### After
- **25 articles available**
- **Unique images for each article**
- **3 pages of organized content**
- **Google-style pagination**
- **Smart navigation with ellipsis**
- **Better article showcase**

## Files Modified

1. **`app/api/news/latest/route.ts`**
   - Increased queries from 4 → 8
   - Increased pageSize from 10 → 20
   - Increased slice limit from 10 → 25
   - Added `getPlaceholderImage()` function with 25 images
   - Added `total` to response

2. **`app/api/ai-news/route.ts`**
   - Updated limit to support up to 25 items

3. **`components/ai-news-page.tsx`**
   - Added `currentPage` state
   - Added `itemsPerPage = 9` constant
   - Implemented pagination logic
   - Added Google-style page number rendering
   - Added smart ellipsis handling
   - Added pagination info display
   - Reset page on filter changes
   - Added smooth scroll to top

## Pagination Calculation

```javascript
// For 25 articles with 9 per page:
totalPages = Math.ceil(25 / 9) = 3

Page 1: Articles 1-9
Page 2: Articles 10-18
Page 3: Articles 19-25 (7 articles)

Current Page = 2:
Shows pages: 1, 2, 3, ..., 100, 101, 102
Actually: 1, 2, 3 (no ellipsis needed for 3 pages)
```

## Next Steps

Users can now:
1. ✅ View **25 AI news articles** instead of 10
2. ✅ See **unique images** for each article
3. ✅ Navigate with **3-page pagination**
4. ✅ Use **Google-style page numbers**
5. ✅ Click **Previous/Next buttons**
6. ✅ See **pagination info** at bottom
7. ✅ Automatic **scroll to top** on page change

## GitHub Commits
- `feat: add pagination and increase news items to 25 with unique images`

---

**Status:** ✅ All features working perfectly!
