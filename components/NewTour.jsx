"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import TourInfo from "./TourInfo";
import { createNewTour, generateTourResponse, getExistingTour } from "@/utils/action";
import toast from "react-hot-toast";

const NewTour = () => {
  const queryClient = useQueryClient();
  const {
    mutate,
    isPending,
    data: tour,
  } = useMutation({
    mutationFn: async (destionation) => {
      const existingTouer = await getExistingTour(destionation);

      if (existingTouer) return existingTouer;

      const newTour = await generateTourResponse(destionation);
      if (newTour) {
        await createNewTour(newTour);
        queryClient.invalidateQueries({ queryKey: ["tours"] });
        return newTour;
      }
      toast.error("No matching tour found. Please try again.");
      return null;
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
