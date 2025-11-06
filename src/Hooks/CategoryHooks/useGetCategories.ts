import { useQuery } from "@tanstack/react-query";
import MainApi from "../../api/MainApi";
import type { Category } from "../../common/Common";

const GetCategoiresFromApi = async () => {
  const api = MainApi;
  const response = await api.get("/Category/getAllCategoires");
  return response.data as Category[];
};

const useGetCategories = () => {
  return useQuery({
    queryKey: ["Categories"],
    queryFn : GetCategoiresFromApi
  });
};

export default useGetCategories;