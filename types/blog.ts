export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  content: string;
  excerpt: string;
  readingTime: number;
  published: boolean;
}

export interface BlogMetadata {
  title: string;
  description: string;
  date: string;
  tags: string[];
  published: boolean;
}