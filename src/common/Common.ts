import type { Dispatch, SetStateAction } from "react";

export type ThemeContextType = [string, Dispatch<SetStateAction<string>>];

export type LocalizationContextType = [string, Dispatch<SetStateAction<string>>];

export interface CarouselDate {
  id: number;
  imageUrl: string;
  arabicTitle: string;
  englishTitle: string;
  englishDescription: string;
  arabicDescription: string;
  index?:number|null;
}

export type useQueryCarouselResponseType = {
  data: CarouselDate[] | undefined;
  error: Error | null;
  isLoading: boolean;
};

export interface ApiResponse {
  statusCode: number;
  message: string;
}