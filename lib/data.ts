import books from "@/data/books.json";
import testimonials from "@/data/testimonials.json";

export interface PortfolioItem {
  title: string;
  icon: string;
  description: string;
  url: string;
  status: string | null;
}

export interface Book {
  title: string;
  author: string;
  description: string;
  url: string;
  category: string;
}

export interface Testimonial {
  text: string;
  author: string;
  title: string;
  company: string;
  url: string;
}

export const getPortfolio = (): PortfolioItem[] => {
  return [];
};

export const getBooks = (): Book[] => {
  return books;
};

export const getTestimonials = (): Testimonial[] => {
  return testimonials;
};
