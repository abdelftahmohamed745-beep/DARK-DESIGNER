export interface Design {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  imageUrl: string; // base64 or URL
  price?: number;
  allowCustomQuotes: boolean;
  designerName: string;
  designerAvatar: string;
  createdAt: string;
  likes: number;
  views: number;
  featured?: boolean;
}

export interface Inquiry {
  id: string;
  designId?: string;
  designTitle?: string;
  customerName: string;
  customerEmail: string;
  customerCompany?: string;
  message: string;
  budget?: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'responded';
}

export type Category = 'All' | 'UI/UX Design' | 'Graphic Design' | '3D Art' | 'Brand Identity' | 'Illustration' | 'Motion Graphics';

export interface ToastMessage {
  id: string;
  type: 'success' | 'info' | 'error';
  title: string;
  description: string;
}
