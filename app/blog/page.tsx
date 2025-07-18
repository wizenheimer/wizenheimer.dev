import { getAllPosts } from '@/lib/blog';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';
import BlogNav from '@/components/blog-nav';
import { siteConfig } from '@/config/site';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: `blog | ${siteConfig.name}`,
  description: "some learnings from building and breaking things.",
};

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <div className="font-mono">
      <BlogNav />
      <main className="px-4 max-w-4xl mx-auto min-h-screen">
        <div className="max-w-xl py-5">
          <h1 className="text-3xl font-bold mb-4 cursor-default h-[80px] sm:h-auto">
            <span className="inline-block">
              <span className="">blog</span>
            </span>
          </h1>
          <p className="text-sm">some learnings from building and breaking things.</p>
        </div>
        
        {posts.length === 0 ? (
          <p className="text-sm text-muted-foreground font-mono">
            No blog posts yet. Create your first post by adding a markdown file to the content/blog directory.
          </p>
        ) : (
          <div className="space-y-5">
            {posts.map((post: BlogPost) => (
              <article key={post.slug} className="border-b border-border py-5">
                <Link href={`/blog/${post.slug}`} className="block group">
                  <h2 className="text-xl mb-2 text-foreground group-hover:[color:var(--color-primary)] lowercase">
                    {post.title}
                  </h2>
                  <div className="flex items-center text-muted-foreground text-sm mb-4 font-mono lowercase">
                    <span>{new Date(post.date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    }).toLowerCase()}</span>
                    <span className="mx-2">•</span>
                    <span>{post.readingTime} min read</span>
                  </div>
                  <p className="text-muted-foreground font-mono text-sm lowercase">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}