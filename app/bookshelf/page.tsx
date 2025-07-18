import BlogNav from "@/components/blog-nav";
import { Bookshelf } from "@/components/bookshelf";
import { siteConfig } from "@/config/site";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: `bookshelf | ${siteConfig.name}`,
  description: "my reading list",
};

export default function BookshelfPage() {
  return (
    <div className="font-mono">
      <BlogNav />
      <main className="px-4 max-w-4xl mx-auto min-h-screen">
        <div className="max-w-xl py-5">
          <h1 className="text-3xl font-bold mb-4 cursor-default h-[80px] sm:h-auto">
            <span className="inline-block">
              <span className="">bookshelf</span>
            </span>
          </h1>
          <p className="text-sm">my reading list</p>
        </div>

        <Bookshelf />
      </main>
    </div>
  );
}
