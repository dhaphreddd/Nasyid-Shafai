export interface Nasyid {
  id: string;
  judul: string;
  lirik?: string;
  images: string[];
}

export interface User {
  uid: string;
  email: string;
  role: 'admin' | 'user' | string;
}

export interface UploadProgress {
  fileName: string;
  progress: number;
}
