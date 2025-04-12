import useGetRestaurants from "@/hooks/useGetRestaurants";
import ShimmerHome from "@/components/shimmer/ShimmerHome";
import WhatsOnMindSection from "@/components/home/WhatsOnMindSection";
import TopChainSection from "@/components/home/TopChainSection";
import AllRestaurantsSection from "@/components/home/AllRestaurantsSection";

const Home = () => {
    const { isLoading, WhatsOnMind, TopChain, AllRestaurants } =
        useGetRestaurants();

    if (isLoading) return <ShimmerHome />;

    return (
        <div className="container mx-auto mt-7 mb-10 px-5 overflow-hidden">
            <WhatsOnMindSection data={WhatsOnMind} />
            <TopChainSection data={TopChain} />
            <AllRestaurantsSection data={AllRestaurants} />
        </div>
    );
};

export default Home;
