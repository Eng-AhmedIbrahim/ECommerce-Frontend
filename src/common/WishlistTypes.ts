export interface WishlistItemBodyRequest {
  userId: string;
  productId: number;
}


export interface WishlistItem {
  id: string; 
  productId: string;
  productName: string;
  imageUrl: string;
  price: number;
  addedDate: string;
}

export interface Wishlist {
  userId: string;
  items: WishlistItem[];
}