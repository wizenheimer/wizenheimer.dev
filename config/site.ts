export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "wizenheimer",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "your favourite engineer's favourite engineer",
  url: process.env.NEXT_PUBLIC_URL || "",
  ogImage: process.env.NEXT_PUBLIC_OG_IMAGE || "",

  // Hero Section
  heroTitle:
    process.env.NEXT_PUBLIC_HERO_TITLE ||
    "your favourite engineer's favourite engineer",
  heroDescription:
    process.env.NEXT_PUBLIC_HERO_DESCRIPTION ||
    "my tiny corner on the internet",

  // Social Links
  linkedinUrl:
    process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com/in/0xNayan",
  twitterUrl: process.env.NEXT_PUBLIC_TWITTER_URL || "https://x.com/0xNayan",
  email: process.env.NEXT_PUBLIC_EMAIL || "xnayankumar@gmail.com",
  githubUrl:
    process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com/wizenheimer",

  // External Links
  websiteUrl: process.env.NEXT_PUBLIC_WEBSITE_URL || "https://wizenheimer.dev",
  githubRepoUrl:
    process.env.NEXT_PUBLIC_GITHUB_REPO_URL ||
    "https://github.com/wizenheimer/wizenheimer.dev",

  // Personal Info
  authorName: process.env.NEXT_PUBLIC_AUTHOR_NAME || "Nayan Kumar",
};
