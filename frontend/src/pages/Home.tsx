import useGetRestaurants from "@/hooks/useGetRestaurants";
import ShimmerHome from "@/components/shimmer/ShimmerHome";
import WhatsOnMindSection from "@/components/home/WhatsOnMindSection";
import TopChainSection from "@/components/home/TopChainSection";
import AllRestaurantsSection from "@/components/home/AllRestaurantsSection";
import { useAppSelector } from "@/store/hooks";
import "@/styles/home.css";

const Home = () => {
    const {
        isLoading,
        WhatsOnMind,
        TopChain,
        AllRestaurants,
        FilteredRestaurants,
        setFilteredRestaurants
    } = useGetRestaurants();
    const location = useAppSelector((store) => store.location.location);

    if (isLoading) return <ShimmerHome />;

    return (
        <div className="container mx-auto mt-7 mb-10 px-5 overflow-hidden min-h-screen">
            <WhatsOnMindSection data={WhatsOnMind} />
            <TopChainSection
                data={TopChain}
                city={location?.city || "Kolkata"}
            />
            <AllRestaurantsSection
                data={AllRestaurants}
                city={location?.city || "Kolkata"}
                FilteredRestaurants={FilteredRestaurants}
                setFilteredRestaurants={setFilteredRestaurants}
            />
        </div>
    );
};

export default Home;
