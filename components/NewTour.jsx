"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import TourInfo from "./TourInfo";
import {
  createNewTour,
  fetchUserTokensById,
  generateTourResponse,
  getExistingTour,
  subtractTokens,
} from "@/utils/action";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/nextjs";

const NewTour = () => {
  const queryClient = useQueryClient();

  const { userId } = useAuth();

  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destionation) => {
      const existingTouer = await getExistingTour(destionation);

      if (existingTouer) return existingTouer;

      const currentTokens = await fetchUserTokensById(userId);
      if (currentTokens < 10) {
        toast.error("You don't have enough tokens to generate a new tour.");
        return null;
      }

      const newTour = await generateTourResponse(destionation);

      if (!newTour) {
        toast.error("No tour found for this destination.");
        return null;
      }

      const response = await createNewTour(newTour.tour);
      queryClient.invalidateQueries({ queryKey: ["tours"] });
      const newTokens = await subtractTokens(userId, newTour.tokens);
      toast.success(`Tour generated successfully. You have ${newTokens} tokens left.`);
      return newTour.tour;
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const destionation = Object.fromEntries(formData.entries());
    mutate(destionation);
  };

  if (isPending) {
    return <span className="loading loading-lg"></span>;
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <h2 className="mb-4">Select your dream destination</h2>
        <div className="join w-full">
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="city"
            name="city"
            required
          />
          <input
            type="text"
            className="input input-bordered join-item w-full"
            placeholder="country"
            name="country"
            required
          />
          <button className="btn btn-primary join-item" type="submit">
            generate tour
          </button>
        </div>
      </form>
      <div className="mt-16">{tour ? <TourInfo tour={tour} /> : null}</div>
    </>
  );
};

export default NewTour;
