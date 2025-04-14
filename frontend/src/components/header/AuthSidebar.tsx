import { useState } from "react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import { UserRound } from "lucide-react";

const AuthSidebar = () => {
    const [isLoginForm, setIsLoginForm] = useState<boolean>(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);

    return (
        <>
            <Sheet
                open={isSidebarOpen}
                onOpenChange={setIsSidebarOpen}>
                <SheetTrigger className="flex items-center gap-2 cursor-pointer orange-hover font-medium">
                    <UserRound className="w-5" />
                    <span>Sign In</span>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl px-10 pt-10">
                    <SheetHeader className="p-0">
                        <SheetTitle>
                            <div className="flex items-center justify-between">
                                {isLoginForm ? (
                                    <div>
                                        <h3 className="text-3xl">Login</h3>
                                        <p className="mt-1">
                                            or{" "}
                                            <span
                                                className="text-orange-500 cursor-pointer"
                                                onClick={() => {
                                                    setIsLoginForm(false);
                                                }}>
                                                create your account
                                            </span>
                                        </p>
                                    </div>
                                ) : (
                                    <div>
                                        <h3 className="text-3xl">Signup</h3>
                                        <p className="mt-1">
                                            or{" "}
                                            <span
                                                className="text-orange-500 cursor-pointer"
                                                onClick={() => {
                                                    setIsLoginForm(true);
                                                }}>
                                                login to your account
                                            </span>
                                        </p>
                                    </div>
                                )}
                                <img
                                    className="h-24"
                                    loading="lazy"
                                    src="/assets/food-img.avif"
                                    alt="img"
                                />
                            </div>
                        </SheetTitle>
                        <SheetDescription></SheetDescription>
                    </SheetHeader>
                    {isLoginForm ? <LoginForm setIsSidebarOpen={setIsSidebarOpen} /> : <SignupForm setIsLoginForm={setIsLoginForm} />}
                </SheetContent>
            </Sheet>
        </>
    );
};

export default AuthSidebar;
