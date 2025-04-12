import { Link } from "react-router";
import { UserRound } from "lucide-react";
import LocationSidebar from "@/components/sidebar/LocationSidebar";

const Header = () => {
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
                    <button className="flex items-center gap-2 cursor-pointer orange-hover font-medium">
                        <UserRound className="w-5" />
                        <span>Login</span>
                    </button>
                    <Link
                        to="/checkout"
                        className="flex items-center gap-2 group orange-hover font-medium"
                    >
                        <span className="relative overflow-hidden group">
                            <svg
                                className="stroke-gray-500 fill-white stroke-2 group-hover:stroke-orange-500 transition-all duration-300"
                                viewBox="-1 0 37 32"
                                height="20"
                                width="20"
                            >
                                <path d="M4.438 0l-2.598 5.11-1.84 26.124h34.909l-1.906-26.124-2.597-5.11z"></path>
                            </svg>
                            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-sm font-bold">
                                {0}
                            </span>
                        </span>
                        Cart
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default Header;
