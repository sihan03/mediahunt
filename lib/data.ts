export interface MediaSource {
  id: string;
  title: string;
  url: string;
  description: string;
  category: string;
  imageUrl: string;
  votes: number;
  userVote?: 'up' | 'down' | null;
}

export type Category = 'all' | 'newsletter' | 'publication' | 'youtube' | 'podcast';

export const categories: Category[] = ['all', 'newsletter', 'publication', 'youtube', 'podcast'];

export const mediaSources: MediaSource[] = [
  {
    id: '1',
    title: "Lenny's Newsletter",
    url: "https://www.lennysnewsletter.com/",
    category: "newsletter",
    description: "A newsletter on product, growth, and career development.",
    imageUrl: "/lenny.webp",
    votes: 124
  },
  {
    id: '2',
    title: "MIT Tech Review",
    url: "https://www.technologyreview.com/",
    category: "publication",
    description: "The latest technology news and analysis from MIT.",
    imageUrl: "https://www.technologyreview.com/wp-content/uploads/2021/03/MIT-Tech-Review-Logo-2021-1.png",
    votes: 98
  },
  {
    id: '3',
    title: "TLDR",
    url: "https://tldr.tech/",
    category: "newsletter",
    description: "Byte-sized tech news for busy people.",
    imageUrl: "https://tldr.tech/apple-touch-icon.png",
    votes: 85
  },
  {
    id: '4',
    title: "Acquired",
    url: "https://www.acquired.fm/",
    category: "podcast",
    description: "A podcast about technology acquisitions and IPOs.",
    imageUrl: "https://images.transistor.fm/file/transistor/images/show/5389/full_1597954636-artwork.jpg",
    votes: 112
  },
  {
    id: '5',
    title: "Fireship",
    url: "https://www.youtube.com/@Fireship",
    category: "youtube",
    description: "Fast-paced videos about modern web development.",
    imageUrl: "/fireship.png",
    votes: 156
  },
  {
    id: '6',
    title: "AI Engineer",
    url: "https://www.youtube.com/@aiDotEngineer",
    category: "youtube",
    description: "Content focused on AI engineering and applications.",
    imageUrl: "/aie.png",
    votes: 78
  },
  {
    id: '7',
    title: "Andrej Karpathy",
    url: "https://www.youtube.com/@AndrejKarpathy",
    category: "youtube",
    description: "Educational content from AI researcher and former Tesla AI Director.",
    imageUrl: "/andrej.jpg",
    votes: 132
  }
]; 