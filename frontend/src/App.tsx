import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import Home from "@/pages/Home";
import ScrollToTop from "@/components/common/ScrollToTop";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import RestaurantMenu from "@/pages/RestaurantMenu";
import Checkout from "@/pages/Checkout";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";

const App = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route
                    path="/"
                    element={<Home />}
                />
                <Route
                    path="/login"
                    element={<Login />}
                />
                <Route
                    path="/signup"
                    element={<Signup />}
                />
                <Route
                    path="/restaurant/menu/:resId"
                    element={<RestaurantMenu />}
                />
                <Route
                    path="/checkout"
                    element={<Checkout />}
                />
            </Routes>
            <ScrollToTop />
            <Toaster />
            <Footer />
        </>
    );
};

export default App;

