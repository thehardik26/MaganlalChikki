import { useQuery } from "@tanstack/react-query"
import getBanner from "../utils/getBanner"

export default function StaticPics() {

    const { data } = useQuery({
        queryKey: ["StaticPics"],
        queryFn: getBanner
    });

    console.log(data)

    return (
        <>
            <div className="relative flex flex-col md:flex-row justify-evenly items-center gap-6 m-6 py-8 shadow-2xl overflow-hidden">
                {data?.map((item, index) => (
                    <img
                        key={index}
                        src={item.banner_image}
                        alt=""
                        className="w-full max-w-[90%] md:w-auto transition duration-300 ease-in-out hover:scale-105 rounded-sm"
                    />
                ))}
            </div>
        </>
    )
}