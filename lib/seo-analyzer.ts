export interface SeoCheckResult {
  id: string;
  title: string;
  description: string;
  status: 'pass' | 'warning' | 'fail';
  recommendation: string;
}

export interface SeoAnalysisOutput {
  score: number; // 0 - 100
  grade: 'good' | 'ok' | 'poor';
  passedCount: number;
  warningCount: number;
  failedCount: number;
  checks: SeoCheckResult[];
  metrics: {
    wordCount: number;
    charCount: number;
    readingTimeMinutes: number;
    titleLength: number;
    titlePixelWidthEstimate: number;
    descriptionLength: number;
    descriptionPixelWidthEstimate: number;
    h1Count: number;
    h2Count: number;
    h3Count: number;
    totalHeadings: number;
    internalLinksCount: number;
    externalLinksCount: number;
    imagesCount: number;
    imagesWithAltCount: number;
    avgParagraphWordCount: number;
  };
}

export function analyzePostSeo(params: {
  title: string;
  slug: string;
  content: string;
  seoTitle: string;
  metaDescription: string;
  focusKeyword: string;
  coverImageAlt?: string;
}): SeoAnalysisOutput {
  const {
    title,
    slug,
    content,
    seoTitle,
    metaDescription,
    focusKeyword,
    coverImageAlt,
  } = params;

  const keyword = focusKeyword ? focusKeyword.trim().toLowerCase() : '';
  const effectiveTitle = (seoTitle || title || '').trim();
  const effectiveDesc = (metaDescription || '').trim();
  const effectiveSlug = (slug || '').trim().toLowerCase();

  // Strip HTML tags for text analysis
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textContent.length > 0 ? textContent.split(/\s+/) : [];
  const wordCount = words.length;
  const charCount = textContent.length;
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

  // Heading counts
  const h1Matches = content.match(/<h1[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  const h2Matches = content.match(/<h2[^>]*>([\s\S]*?)<\/h2>/gi) || [];
  const h3Matches = content.match(/<h3[^>]*>([\s\S]*?)<\/h3>/gi) || [];
  const h1Count = (title ? 1 : 0) + (content ? h1Matches.length : 0);
  const h2Count = h2Matches.length;
  const h3Count = h3Matches.length;

  // Links
  const linkMatches = content.match(/<a\s+[^>]*href=["']([^"']*)["'][^>]*>/gi) || [];
  let internalLinksCount = 0;
  let externalLinksCount = 0;

  linkMatches.forEach((linkTag) => {
    const hrefMatch = linkTag.match(/href=["']([^"']*)["']/i);
    if (hrefMatch && hrefMatch[1]) {
      const url = hrefMatch[1];
      if (
        url.startsWith('/') ||
        url.startsWith('#') ||
        url.includes('dailysmagazine.com') ||
        url.includes('localhost')
      ) {
        internalLinksCount++;
      } else if (url.startsWith('http://') || url.startsWith('https://')) {
        externalLinksCount++;
      }
    }
  });

  // Also check standard markdown links [text](url)
  const mdLinkMatches = content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || [];
  mdLinkMatches.forEach((mdLink) => {
    const urlMatch = mdLink.match(/\[.*\]\((.*)\)/);
    if (urlMatch && urlMatch[1]) {
      const url = urlMatch[1];
      if (url.startsWith('/') || url.includes('dailysmagazine.com')) {
        internalLinksCount++;
      } else if (url.startsWith('http')) {
        externalLinksCount++;
      }
    }
  });

  // Images & Alt text
  const imgTags = content.match(/<img[^>]+>/gi) || [];
  const mdImgs = content.match(/!\[([^\]]*)\]\([^)]+\)/g) || [];
  const totalImages = imgTags.length + mdImgs.length + 1; // +1 for featured image

  let imagesWithAlt = (coverImageAlt && coverImageAlt.trim().length > 0) ? 1 : 0;
  imgTags.forEach((tag) => {
    if (/alt=["'][^"']+["']/i.test(tag)) {
      imagesWithAlt++;
    }
  });
  mdImgs.forEach((md) => {
    const alt = md.match(/!\[([^\]]*)\]/);
    if (alt && alt[1] && alt[1].trim().length > 0) {
      imagesWithAlt++;
    }
  });

  // Paragraph length analysis
  const paragraphs = content
    .split(/<\/p>|\n\n/)
    .map((p) => p.replace(/<[^>]*>/g, '').trim())
    .filter((p) => p.length > 20);
  const avgParagraphWordCount =
    paragraphs.length > 0
      ? Math.round(
          paragraphs.reduce((acc, p) => acc + p.split(/\s+/).length, 0) / paragraphs.length
        )
      : 0;

  // Approximate pixel widths
  const titlePixelWidthEstimate = Math.round(effectiveTitle.length * 9.8);
  const descriptionPixelWidthEstimate = Math.round(effectiveDesc.length * 6.5);

  const checks: SeoCheckResult[] = [];
  let scorePoints = 0;
  const maxScore = 100;

  // Check 1: Focus Keyword Defined
  if (!keyword) {
    checks.push({
      id: 'focus-keyword-set',
      title: 'Focus Keyword Defined',
      description: 'No focus keyword set for this content.',
      status: 'fail',
      recommendation: 'Specify a primary focus keyword to evaluate target query density.',
    });
  } else {
    checks.push({
      id: 'focus-keyword-set',
      title: 'Focus Keyword Defined',
      description: `Targeting primary query: "${focusKeyword}".`,
      status: 'pass',
      recommendation: 'Target query is established.',
    });
    scorePoints += 10;
  }

  // Check 2: Focus Keyword in SEO Title
  if (keyword && effectiveTitle.toLowerCase().includes(keyword)) {
    checks.push({
      id: 'keyword-in-title',
      title: 'Focus Keyword in SEO Title',
      description: 'Your focus keyword appears prominently in the SEO title.',
      status: 'pass',
      recommendation: 'Great work maintaining keyword placement in the primary title.',
    });
    scorePoints += 10;
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-title',
      title: 'Focus Keyword in SEO Title',
      description: 'Focus keyword not found in the SEO title.',
      status: 'fail',
      recommendation: 'Include your focus keyword naturally near the beginning of your SEO title.',
    });
  }

  // Check 3: SEO Title Length (50 - 60 characters)
  if (effectiveTitle.length >= 50 && effectiveTitle.length <= 65) {
    checks.push({
      id: 'title-length',
      title: 'SEO Title Length (50–65 chars)',
      description: `Current length is ${effectiveTitle.length} characters (ideal width for Google SERP).`,
      status: 'pass',
      recommendation: 'Length is optimized and will not be truncated in desktop/mobile results.',
    });
    scorePoints += 10;
  } else if (effectiveTitle.length >= 35 && effectiveTitle.length < 50) {
    checks.push({
      id: 'title-length',
      title: 'SEO Title Length',
      description: `Title is somewhat short (${effectiveTitle.length} characters). Target 50–60 characters.`,
      status: 'warning',
      recommendation: 'Consider adding context or your brand suffix ("| DailysMagazine") to maximize SERP click-through.',
    });
    scorePoints += 5;
  } else if (effectiveTitle.length > 65) {
    checks.push({
      id: 'title-length',
      title: 'SEO Title Length',
      description: `Title is too long (${effectiveTitle.length} characters) and will be truncated with ellipsis (...).`,
      status: 'warning',
      recommendation: 'Shorten the title to under 60 characters to ensure full visibility.',
    });
    scorePoints += 4;
  } else {
    checks.push({
      id: 'title-length',
      title: 'SEO Title Length',
      description: 'Title is critically short or empty.',
      status: 'fail',
      recommendation: 'Write an engaging SEO title between 50 and 60 characters.',
    });
  }

  // Check 4: Focus Keyword in Meta Description
  if (keyword && effectiveDesc.toLowerCase().includes(keyword)) {
    checks.push({
      id: 'keyword-in-desc',
      title: 'Focus Keyword in Meta Description',
      description: 'Focus keyword appears in the meta description snippet.',
      status: 'pass',
      recommendation: 'Google boldens matching search queries in snippet descriptions.',
    });
    scorePoints += 10;
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-desc',
      title: 'Focus Keyword in Meta Description',
      description: 'Focus keyword missing from the meta description.',
      status: 'fail',
      recommendation: 'Incorporate your keyword into the first sentence of your meta description.',
    });
  }

  // Check 5: Meta Description Length (140 - 160 characters)
  if (effectiveDesc.length >= 130 && effectiveDesc.length <= 165) {
    checks.push({
      id: 'desc-length',
      title: 'Meta Description Length (130–165 chars)',
      description: `Optimal length (${effectiveDesc.length} characters). Displays cleanly without clipping.`,
      status: 'pass',
      recommendation: 'Ideal character length.',
    });
    scorePoints += 10;
  } else if (effectiveDesc.length > 165) {
    checks.push({
      id: 'desc-length',
      title: 'Meta Description Length',
      description: `Description is too long (${effectiveDesc.length} chars). Mobile snippets truncate around 155 chars.`,
      status: 'warning',
      recommendation: 'Trim description to roughly 150 characters.',
    });
    scorePoints += 5;
  } else if (effectiveDesc.length > 0 && effectiveDesc.length < 130) {
    checks.push({
      id: 'desc-length',
      title: 'Meta Description Length',
      description: `Description is brief (${effectiveDesc.length} chars). You have space for an engaging call to action.`,
      status: 'warning',
      recommendation: 'Expand with more descriptive context to reach ~150 characters.',
    });
    scorePoints += 5;
  } else {
    checks.push({
      id: 'desc-length',
      title: 'Meta Description Length',
      description: 'Missing meta description. Search engines will auto-generate arbitrary excerpts.',
      status: 'fail',
      recommendation: 'Craft a custom meta description to control your SERP snippet CTR.',
    });
  }

  // Check 6: Focus Keyword in URL Slug
  const slugClean = effectiveSlug.replace(/-/g, ' ');
  if (keyword && slugClean.includes(keyword)) {
    checks.push({
      id: 'keyword-in-slug',
      title: 'Focus Keyword in URL Slug',
      description: 'Focus keyword is present in the permalink URL slug.',
      status: 'pass',
      recommendation: 'Clean permalink provides immediate topical authority.',
    });
    scorePoints += 10;
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-slug',
      title: 'Focus Keyword in URL Slug',
      description: 'Focus keyword is not found in the permalink slug.',
      status: 'warning',
      recommendation: 'Edit the permalink slug to include your primary target keyword.',
    });
    scorePoints += 4;
  }

  // Check 7: Focus Keyword in First 100 Words
  const first100Words = words.slice(0, 100).join(' ').toLowerCase();
  if (keyword && first100Words.includes(keyword)) {
    checks.push({
      id: 'keyword-in-intro',
      title: 'Keyword in First 100 Words',
      description: 'Your focus keyword is introduced immediately in the opening paragraph.',
      status: 'pass',
      recommendation: 'Great topical introduction.',
    });
    scorePoints += 10;
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-intro',
      title: 'Keyword in First 100 Words',
      description: 'Focus keyword does not appear in the lead introductory paragraph.',
      status: 'warning',
      recommendation: 'Mention the target query within the first two sentences.',
    });
    scorePoints += 3;
  }

  // Check 8: Focus Keyword in H2 / H3 Subheadings
  const headingsText = (h2Matches.join(' ') + ' ' + h3Matches.join(' ')).toLowerCase();
  if (keyword && headingsText.includes(keyword)) {
    checks.push({
      id: 'keyword-in-headings',
      title: 'Focus Keyword in Subheadings (H2/H3)',
      description: 'Focus keyword appears in at least one subheading.',
      status: 'pass',
      recommendation: 'Structured subheadings reinforce document outline relevancy.',
    });
    scorePoints += 10;
  } else if (keyword) {
    checks.push({
      id: 'keyword-in-headings',
      title: 'Focus Keyword in Subheadings (H2/H3)',
      description: 'No H2 or H3 subheadings contain the focus keyword.',
      status: 'warning',
      recommendation: 'Add the keyword or a close semantic variation to an H2 section title.',
    });
    scorePoints += 3;
  }

  // Check 9: Content Length / Word Count
  if (wordCount >= 600) {
    checks.push({
      id: 'content-length',
      title: 'Content Depth & Word Count',
      description: `Comprehensive longform depth (${wordCount} words). Far exceeds minimum indexing thresholds.`,
      status: 'pass',
      recommendation: 'Excellent depth for competitive search indexing.',
    });
    scorePoints += 10;
  } else if (wordCount >= 300) {
    checks.push({
      id: 'content-length',
      title: 'Content Depth & Word Count',
      description: `Moderate length (${wordCount} words).`,
      status: 'warning',
      recommendation: 'Consider expanding to 600+ words to rank for long-tail keywords.',
    });
    scorePoints += 5;
  } else {
    checks.push({
      id: 'content-length',
      title: 'Content Depth & Word Count',
      description: `Thin content detected (${wordCount} words). Search engines penalize pages <300 words.`,
      status: 'fail',
      recommendation: 'Expand with comprehensive reporting, evidence, and structured takeaways.',
    });
  }

  // Check 10: Heading Structure Hierarchy
  if (h1Count <= 2 && h2Count >= 1) {
    checks.push({
      id: 'heading-hierarchy',
      title: 'Heading Hierarchy (H1 / H2 / H3)',
      description: `Logical structure detected (1 primary H1 and ${h2Count} H2 subheadings).`,
      status: 'pass',
      recommendation: 'Semantic hierarchy is compliant with accessibility and search crawlers.',
    });
    scorePoints += 5;
  } else {
    checks.push({
      id: 'heading-hierarchy',
      title: 'Heading Hierarchy',
      description: `Missing subheadings or irregular structure (${h2Count} H2 tags found).`,
      status: 'warning',
      recommendation: 'Divide long blocks of text with H2 and H3 subheadings.',
    });
    scorePoints += 2;
  }

  // Check 11: Internal & External Linking
  if (internalLinksCount >= 2 && externalLinksCount >= 1) {
    checks.push({
      id: 'link-profile',
      title: 'Internal & External Link Profile',
      description: `Healthy link architecture: ${internalLinksCount} internal links and ${externalLinksCount} authoritative outbound citations.`,
      status: 'pass',
      recommendation: 'Great balance of internal discovery and factual citation.',
    });
    scorePoints += 10;
  } else if (internalLinksCount >= 1 || externalLinksCount >= 1) {
    checks.push({
      id: 'link-profile',
      title: 'Internal & External Link Profile',
      description: `Found ${internalLinksCount} internal links and ${externalLinksCount} external links.`,
      status: 'warning',
      recommendation: 'Add at least 2 internal links to related DailysMagazine articles and 1 external citation.',
    });
    scorePoints += 5;
  } else {
    checks.push({
      id: 'link-profile',
      title: 'Internal & External Link Profile',
      description: 'Zero links detected. Page acts as a dead-end for search bots.',
      status: 'fail',
      recommendation: 'Link to related category articles and cite primary sources.',
    });
  }

  // Check 12: Image Alt Text
  if (totalImages > 0 && imagesWithAlt === totalImages) {
    checks.push({
      id: 'image-alt-tags',
      title: 'Image Alt Text Accessibility',
      description: `All ${totalImages} images have descriptive alt text tags.`,
      status: 'pass',
      recommendation: '100% image accessibility compliance.',
    });
    scorePoints += 5;
  } else if (totalImages > 0 && imagesWithAlt > 0) {
    checks.push({
      id: 'image-alt-tags',
      title: 'Image Alt Text Accessibility',
      description: `${imagesWithAlt} of ${totalImages} images have Alt Text defined.`,
      status: 'warning',
      recommendation: 'Ensure all images specify descriptive Alt Text for screen readers and Google Image search.',
    });
    scorePoints += 2;
  } else {
    checks.push({
      id: 'image-alt-tags',
      title: 'Image Alt Text Accessibility',
      description: 'Missing Alt text on images.',
      status: 'fail',
      recommendation: 'Add Alt text describing image subject matter.',
    });
  }

  const normalizedScore = Math.min(100, Math.max(0, scorePoints));
  const grade: 'good' | 'ok' | 'poor' =
    normalizedScore >= 80 ? 'good' : normalizedScore >= 50 ? 'ok' : 'poor';

  const passedCount = checks.filter((c) => c.status === 'pass').length;
  const warningCount = checks.filter((c) => c.status === 'warning').length;
  const failedCount = checks.filter((c) => c.status === 'fail').length;

  return {
    score: normalizedScore,
    grade,
    passedCount,
    warningCount,
    failedCount,
    checks,
    metrics: {
      wordCount,
      charCount,
      readingTimeMinutes,
      titleLength: effectiveTitle.length,
      titlePixelWidthEstimate,
      descriptionLength: effectiveDesc.length,
      descriptionPixelWidthEstimate,
      h1Count,
      h2Count,
      h3Count,
      totalHeadings: h1Count + h2Count + h3Count,
      internalLinksCount,
      externalLinksCount,
      imagesCount: totalImages,
      imagesWithAltCount: imagesWithAlt,
      avgParagraphWordCount,
    },
  };
}
