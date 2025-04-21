import { lazy, Suspense, useEffect } from "react";
import { Route, Routes } from "react-router";
import { Toaster } from "react-hot-toast";
import Home from "@/pages/Home";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCart } from "@/store/slices/cartSlice";
import Loader from "@/components/loader/Loader";
import ShimmerMenu from "./components/loader/ShimmerMenu";

const RestaurantMenu = lazy(() => import("@/pages/RestaurantMenu"));
const Checkout = lazy(() => import("@/pages/Checkout"));
const Login = lazy(() => import("@/pages/Login"));
const Signup = lazy(() => import("@/pages/Signup"));

const App = () => {
    const { user, guestId } = useAppSelector((store) => store.user);
    const dispatch = useAppDispatch();

    // Fetch cart data
    useEffect(() => {
        if (user && user._id) {
            dispatch(fetchCart({ userId: user._id }));
        } else if (guestId) {
            dispatch(fetchCart({ guestId }));
        }
    }, [dispatch, guestId, user]);

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
                    element={
                        <Suspense fallback={<Loader />}>
                            <Login />
                        </Suspense>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <Suspense fallback={<Loader />}>
                            <Signup />
                        </Suspense>
                    }
                />
                <Route
                    path="/restaurant/menu/:resId"
                    element={
                        <Suspense fallback={<ShimmerMenu />}>
                            <RestaurantMenu />
                        </Suspense>
                    }
                />
                <Route
                    path="/checkout"
                    element={
                        <Suspense fallback={<Loader />}>
                            <Checkout />
                        </Suspense>
                    }
                />
            </Routes>
            <Footer />
            <ScrollToTop />
            <Toaster />
        </>
    );
};

export default App;

