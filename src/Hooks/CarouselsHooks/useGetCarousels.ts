import { useQuery } from "@tanstack/react-query";
import MainApi from "../../api/MainApi";
import type { CarouselDate, useQueryCarouselResponseType } from "../../common/Common";

const getCarousels = async (): Promise<CarouselDate[]> => {
  const api = MainApi;
  const response = await api.get("/api/Carousel/get-carousels");
  return response.data as CarouselDate[];
};
const useGetCarousels = () :useQueryCarouselResponseType => {
    return useQuery<CarouselDate[], Error>({
        queryKey:["carousels"],
        queryFn : getCarousels,
        staleTime: Infinity,
        retry: 1,        
    })
};
export default useGetCarousels;