import TourInfo from "@/components/TourInfo";
import { generateTourImage, getSinglePageTour } from "@/utils/action";
import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

const url = `https://api.unsplash.com/search/photos?client_id=${process.env.UNSPLASH_API_KEY}&query=`;

const SingleTourPage = async ({ params }) => {
  const tour = await getSinglePageTour(params.id);
  if (!tour) {
    redirect("/tours");
  }

  // const { data } = await axios.get(`${url}${tour.city}&w=768&h=768`);

  // const tourImage = data?.results[0]?.urls?.raw;

  // const tourImage = await generateTourImage({
  //   city: tour.city,
  //   country: tour.country,
  // });

  const { data } = await axios.get(`${url}${tour.city}&per_page=10`);
  const images = data.results.map((img) => ({ src: img.urls.regular, width: img.width, height: img.height }));

  return (
    <div>
      <Link href="/tours" className="btn btn-secondary mb-12">
        back to tours
      </Link>
      {/* {tourImage ? (
        <div>
          <Image
            src={tourImage}
            width={800} // Match the width and height to your CSS or the URL parameters
            height={800}
            className="rounded-xl shadow-xl mb-16 h-96 w-96 object-cover"
            alt={tour.title}
            priority
          />
        </div>
      ) : null} */}

      <div className="columns-2 sm:columns-3 md:columns-4 lg:columns-5 gap-2 bg-secondary-content p-4 rounded-xl border mb-11 border-black">
        {images.map((image, index) => (
          <div key={index} className="mb-2 break-inside-avoid">
            <Image
              src={image.src}
              width={image.width}
              height={image.height}
              alt={`Image ${index}`}
              className="object-cover rounded-xl transition-transform duration-500 hover:scale-110"
              layout="responsive"
            />
          </div>
        ))}
      </div>
      {/* horizontal line daisyui */}
      <hr className="my-12 border-t-2 border-dashed border-primary" />
      <TourInfo tour={tour} />
    </div>
  );
};

export default SingleTourPage;
