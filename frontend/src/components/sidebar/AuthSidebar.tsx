import { useState } from "react";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToolTipMessage from "@/components/common/ToolTipMessage";
import { LoaderCircle, UserRound } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema, LoginSchemaType } from "@/schemas/authSchema";
import useLogin from "@/hooks/useLogin";

const AuthSidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<LoginSchemaType>({
        resolver: yupResolver(LoginSchema),
        mode: "onChange"
    });

    const { isLoading, handleLogin } = useLogin(reset, setIsSidebarOpen);

    const onLogin = async (data: LoginSchemaType) => {
        await handleLogin(data);
    };

    return (
        <>
            <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <SheetTrigger className="flex items-center gap-2 cursor-pointer orange-hover font-medium">
                    <UserRound className="w-5" />
                    <span>Login</span>
                </SheetTrigger>
                <SheetContent className="w-full sm:max-w-xl px-10 pt-10">
                    <SheetHeader className="p-0">
                        <SheetTitle>
                            <div className="flex items-center justify-between">
                                <h3 className="text-3xl">Login</h3>
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

                    <form
                        noValidate
                        onSubmit={handleSubmit(onLogin)}
                        className="space-y-3"
                    >
                        <div className="relative">
                            <Input
                                type="text"
                                placeholder="Email or Phone Number"
                                {...register("identity")}
                                className={`h-13 rounded-sm text-black border-gray-300 ${
                                    errors?.identity &&
                                    "border-red-500 focus:border-red-500"
                                }`}
                            />
                            {errors?.identity && (
                                <ToolTipMessage
                                    message={errors?.identity?.message}
                                />
                            )}
                        </div>
                        <div className="relative">
                            <Input
                                type="password"
                                placeholder="Password"
                                className={`h-13 rounded-sm text-black border-gray-300 ${
                                    errors?.password &&
                                    "border-red-500 focus:border-red-500"
                                }`}
                                {...register("password")}
                            />
                            {errors?.password && (
                                <ToolTipMessage
                                    message={errors?.password?.message}
                                />
                            )}
                        </div>
                        <div>
                            <Button
                                disabled={!isValid || isLoading}
                                className="w-full h-12 bg-orange-500 font-bold text-base cursor-pointer hover:bg-orange-600 rounded-sm"
                            >
                                {isLoading ? (
                                    <div className="flex items-center gap-2">
                                        <LoaderCircle className="animate animate-spin w-5" />
                                        Processing...
                                    </div>
                                ) : (
                                    "Log In"
                                )}
                            </Button>
                        </div>
                    </form>

                    <div>
                        <p className="text-[#686b78] text-center text-sm">
                            By clicking on Login, I accept the Terms &
                            Conditions & Privacy Policy
                        </p>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default AuthSidebar;
