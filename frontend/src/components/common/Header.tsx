import { Link } from "react-router";
import LocationSidebar from "@/components/header/LocationSidebar";
import CartSidebar from "@/components/header/CartSidebar";
import UserDetails from "@/components/header/UserDetails";
import { useAppSelector } from "@/store/hooks";
import { UserRound } from "lucide-react";

const Header = () => {
    const user = useAppSelector((store) => store.user.user);

    return (
        <header className="py-2 shadow-md sticky w-full top-0 left-0 right-0 z-10 bg-white px-5">
            <div className="container mx-auto flex justify-between items-center text-base">
                <div className="flex items-center gap-5">
                    <Link to="/">
                        <img
                            src="/assets/logo.png"
                            alt="logo"
                            className="h-14 rounded-full border border-black"
                        />
                    </Link>
                    <LocationSidebar />
                </div>
                <div className="flex items-center gap-6">
                    {user ? (
                        <UserDetails user={user} />
                    ) : (
                        <Link
                            to="/login"
                            className="flex items-center gap-2 cursor-pointer orange-hover font-medium">
                            <UserRound className="w-5" />
                            <span>Sign In</span>
                        </Link>
                    )}
                    <CartSidebar />
                </div>
            </div>
        </header>
    );
};

export default Header;
