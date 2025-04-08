import useGetRestaurants from "@/hooks/useGetRestaurants";
import ShimmerHome from "@/components/shimmer/ShimmerHome";
import WhatsOnMindSection from "@/components/home/WhatsOnMindSection";
import TopChainSection from "@/components/home/TopChainSection";
import "@/styles/home.css";

const Home = () => {
    const { isLoading, WhatsOnMind, TopChain } = useGetRestaurants();

    if (isLoading) return <ShimmerHome />;

    return (
        <div className="container mx-auto mt-7 mb-10 px-[2rem] sm:px-10 overflow-hidden">
            <WhatsOnMindSection data={WhatsOnMind} />
            <TopChainSection data={TopChain} />
        </div>
    );
};

export default Home;
