export type CartItem = {
  id?:number;
  productId: number;
  productName: string;
  productNameAr: string;
  imageUrl: string;
  price: number;
  quantity: number;
  selectedVariants?: Record<string, string[]>;
  originalPrice?: number;
  discountPercentage?: number;
};

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalQuantity: number;
  subTotal: number;
  discountTotal?: number;
  grandTotal: number;
  userId?: string | null;
  isGuest?: boolean;
  updatedAt: string;
}
