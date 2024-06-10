import ToursPage from "@/components/ToursPage";
import { getAllTours } from "@/utils/action";
import { QueryClient } from "@tanstack/react-query";
import { dehydrate, HydrationBoundary, queryClient } from "@tanstack/react-query";

const AllToursPage = async () => {
  const queryClient = new QueryClient();

  const data = await queryClient.prefetchQuery({
    queryKey: ["tours", ""],
    queryFn: getAllTours(),
  });

  console.log(" data is ", data);
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ToursPage />
      {JSON.stringify(data)}
    </HydrationBoundary>
  );
};

export default AllToursPage;
