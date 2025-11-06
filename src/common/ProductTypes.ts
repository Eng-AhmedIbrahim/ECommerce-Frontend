export interface Product {
  id: number;
  arabicName: string;
  englishName: string;
  arabicDescription: string;
  englishDescription: string;
  price: number;
  discountPercentage: number;
  discountedPrice: number;
  stockQuantity: number;
  images: string[];
  categoryId: number;
  variants: Variant[];
  productReviews:ProductReviewToReturnDto[]
}

export interface AppProduct {
  Product: Product;
  Love: boolean;
}

export interface Variant {
  id: number;
  attributeId: number;
  attributeEnglishName: string;
  attributeArabicName: string;
  englishValue: string;
  arabicValue: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string | null;
}

export interface ProductReviewDto{
  productId: number;
  userId: string | null;
  userName:string;
  rating: number,
  comment: string;
}

export interface ProductReviewToReturnDto {
  id:number
  productId: number;
  userId: string;
  rating: number;
  comment?: string | null;
  createdOn: string;
  userName :string;
  userAvatar : string;
}