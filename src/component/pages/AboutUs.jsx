import PageHeader from "../global/PageHeader";
import getAbout from "../utils/getAbout";
import { useQuery } from "@tanstack/react-query";

const AboutUs = () => {
    const { isFetching, data } = useQuery({
        queryKey: ["about"],
        queryFn: getAbout,
    });

    if (isFetching) {
        return (
            <div className="flex h-[60vh] items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-amber-600 border-t-transparent"></div>
            </div>
        );
    }
    const aboutData = data?.[0];
    if (!aboutData) return null;

    return (
        <>
            <PageHeader title={"About Us"}/>
            <div className="max-w-7xl mx-auto px-4">
                <div className="py-6 md:py-10">
                    <div className="flex flex-col md:flex-row gap-8 items-center">

                        <div className="flex-1 pt-6 md:pt-12">
                            <img
                                src={data[0]?.image}
                                className="rounded-xl w-full md:w-500p shadow-2xl transition-all duration-300 ease-in-out hover:scale-105"
                            />
                        </div>

                        <div className="flex-1">
                            <p className="p-4 text-2xl md:text-3xl font-semibold text-amber-600">
                                {data[0]?.title}
                            </p>

                            <p className="px-4 text-justify text-base text-gray-600">
                                {data[0]?.description}
                            </p>
                        </div>

                    </div>
                    <div className="py-6 md:py-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.5}
                                    stroke="currentColor"
                                    className="w-6 h-6"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.182 15.182a4.5 4.5 0 0 1-6.364 0M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75Zm-.375 0h.008v.015h-.008V9.75Z"
                                    />
                                </svg>
                            </div>
                            <p className="text-xl font-semibold text-amber-600">CLIENT SATISFACTION</p>
                        </div>
                        <p className="text-base text-gray-600 text-justify">
                            {data?.[0]?.client_satisfaction}
                        </p>
                    </div>
                    <div className="py-4 md:py-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0a5.995 5.995 0 0 0-4.058-2.932m0 0a3 3 0 1 0-4.681 2.72 5.99 5.99 0 0 0-4.059 2.933m0 0A5.97 5.97 0 0 0 6 18.719m12 0a5.97 5.97 0 0 1-12 0m12 0c0 .225-.012.447-.037.666M12 21a11.947 11.947 0 0 1-5.963-1.584m0 0a4.919 4.919 0 0 1-.037-.666M12 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                </svg>
                            </div>
                            <p className="text-xl font-semibold text-amber-600">OUR TEAM</p>
                        </div>
                        <p className="text-base text-gray-600 text-justify">
                            {data?.[0]?.our_team}
                        </p>
                    </div>
                    <div className="py-4 md:py-8">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-amber-600 text-white shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>

                            </div>
                            <p className="text-xl font-semibold text-amber-600">HISTORY</p>
                        </div>
                        <p className="text-base text-gray-600 text-justify">
                            {data?.[0]?.history}
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AboutUs;