import { useState } from "react";
import { useForm } from "react-hook-form";
import { LoginSchema, LoginSchemaType } from "@/schemas/authSchema";
import { yupResolver } from "@hookform/resolvers/yup";
import useLogin from "@/hooks/useLogin";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToolTipMessage from "@/components/common/ToolTipMessage";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector } from "@/store/hooks";

const Login = () => {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<LoginSchemaType>({
        resolver: yupResolver(LoginSchema),
        mode: "onChange"
    });
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const { isLoading, handleLogin } = useLogin(reset);
    const { guestId } = useAppSelector((store) => store.user);

    const onLogin = async (data: LoginSchemaType) => {
        await handleLogin(data, guestId);
    };

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-1/2">
                <h2 className="text-2xl font-bold text-center mb-5">Login to your Account</h2>
                <form
                    noValidate
                    onSubmit={handleSubmit(onLogin)}
                    className="max-w-lg mx-auto">
                    <div className="relative mb-5">
                        <Input
                            type="text"
                            placeholder="Email or Phone Number"
                            {...register("identity")}
                            className={`h-13 rounded-sm text-black border-gray-300 ${errors?.identity && "border-red-500 focus:border-red-500"}`}
                        />
                        {errors?.identity && <ToolTipMessage message={errors?.identity?.message} />}
                    </div>
                    <div className="relative mb-4">
                        <Input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className={`h-13 rounded-sm text-black border-gray-300 ${errors?.password && "border-red-500 focus:border-red-500"}`}
                            {...register("password")}
                        />
                        <span
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute top-1/2 -translate-y-1/2 right-12 cursor-pointer">
                            {showPassword ? <Eye className="w-5" /> : <EyeOff className="w-5" />}
                        </span>
                        {errors?.password && <ToolTipMessage message={errors?.password?.message} />}
                    </div>
                    <div className="flex justify-between items-center text-sm mb-5">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="terms"
                                defaultChecked
                            />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Remember me
                            </label>
                        </div>
                        <Link
                            to="/forgot-password"
                            className="font-semibold text-orange-500">
                            Forgot Password?
                        </Link>
                    </div>
                    <p className="text-sm text-center mb-4">
                        Not Registered Yet?{" "}
                        <Link
                            to="/signup"
                            className="font-semibold">
                            Signup
                        </Link>
                    </p>
                    <Button
                        disabled={!isValid || isLoading}
                        className="w-full h-12 bg-orange-500 font-bold text-base cursor-pointer hover:bg-orange-600 rounded-sm">
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <LoaderCircle className="animate animate-spin w-5" />
                                Processing...
                            </div>
                        ) : (
                            "Log In"
                        )}
                    </Button>
                    <p className="text-[#686b78] text-center text-sm mt-3">By clicking on Login, I accept the Terms & Conditions & Privacy Policy</p>
                </form>
            </div>
            <div className="w-1/2 h-screen">
                <img
                    className="w-full h-full object-cover"
                    src="/assets/auth-img.jpg"
                    alt="food-img"
                />
            </div>
        </div>
    );
};

export default Login;
