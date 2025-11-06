import { useQuery, type QueryFunctionContext } from "@tanstack/react-query";
import MainApi from "../../api/MainApi";

type useGetProductProps = {
  id: number;
};
const getProductByIdFromApi = async (context: QueryFunctionContext<[string, number]>) => {
  const [ ,id] = context.queryKey;
  const api = MainApi;
  const response = await api.get(`/Product/get-product/${id}`);
  return response.data;
};

const useGetProductById = ({ id }: useGetProductProps) => {
  return useQuery({
    queryKey: ["product", id],
    queryFn: getProductByIdFromApi,
    enabled: !!id,
  });
};

export default useGetProductById;
