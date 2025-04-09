import { Route, Routes } from "react-router";
import Home from "@/pages/Home";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route
                    path="/restaurant/menu/:resId"
                    element={<RestaurantMenu />}
                />
            </Routes>
            <ScrollToTop />
            <Footer />
        </>
    );
};

export default App;
