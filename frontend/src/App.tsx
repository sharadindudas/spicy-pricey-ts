import { Route, Routes } from "react-router";
import Home from "@/pages/Home";
import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Checkout from "@/pages/Checkout";

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
                <Route path="/checkout" element={<Checkout />} />
            </Routes>
            <ScrollToTop />
            <Footer />
        </>
    );
};

export default App;
