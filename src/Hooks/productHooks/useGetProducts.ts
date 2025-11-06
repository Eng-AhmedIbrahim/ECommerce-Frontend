import { useQuery } from "@tanstack/react-query";
import MainApi from "../../api/MainApi";

const GetProducts = async () => {
  const api = MainApi;
  const response = await api.get("/Product/get-products");
  return response.data;
};

const useGetProducts = () => {
  return useQuery({
    queryKey: ["Products"],
    queryFn: GetProducts,
  });
};
export default useGetProducts;