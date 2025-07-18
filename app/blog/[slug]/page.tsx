import { getPostBySlug, markdownToHtml, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import BlogNav from '@/components/blog-nav';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) {
    return {
      title: `post not found | ${siteConfig.name}`,
    };
  }

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const contentHtml = await markdownToHtml(post.content);

  return (
    <div className="font-mono">
      <BlogNav />
      <main className="px-4 max-w-4xl mx-auto min-h-screen">
        <div className="py-5">
          <Link 
            href="/blog"
            className="text-sm hover:[color:var(--color-primary)] transition-colors mb-8 inline-block font-mono"
          >
            ← back to blog
          </Link>
          
          <article className="space-y-8">
            <header className="space-y-4">
              <h1 className="text-3xl font-bold lowercase">
                {post.title}
              </h1>
              
              <div className="flex items-center text-muted-foreground text-sm font-mono lowercase">
                <span>{new Date(post.date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }).toLowerCase()}</span>
                <span className="mx-2">•</span>
                <span>{post.readingTime} min read</span>
              </div>
              
              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded text-xs font-mono lowercase"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </header>
            
            <div 
              className="blog-content font-mono text-sm leading-relaxed"
              dangerouslySetInnerHTML={{ __html: contentHtml }}
            />
          </article>
        </div>
      </main>
    </div>
  );
}