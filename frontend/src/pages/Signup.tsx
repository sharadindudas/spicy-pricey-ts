import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToolTipMessage from "@/components/common/ToolTipMessage";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema, SignupSchemaType } from "@/schemas/authSchema";
import useSignup from "@/hooks/useSignup";
import { Link } from "react-router";

const Signup = () => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isValid }
    } = useForm<SignupSchemaType>({
        resolver: yupResolver(SignupSchema),
        mode: "onChange"
    });

    const { isLoading, handleSignup } = useSignup(reset);

    const onSignup = async (data: SignupSchemaType) => {
        await handleSignup(data);
    };

    return (
        <div className="flex-1 flex items-center justify-center">
            <div className="w-1/2">
                <h2 className="text-2xl font-bold text-center mb-5">Create an Account</h2>
                <form
                    noValidate
                    onSubmit={handleSubmit(onSignup)}
                    className="max-w-lg mx-auto">
                    <div className="relative mb-5">
                        <Input
                            type="text"
                            placeholder="Full Name"
                            {...register("name")}
                            className={`h-13 rounded-sm text-black border-gray-300 ${errors?.name && "border-red-500 focus:border-red-500"}`}
                        />
                        {errors?.name && <ToolTipMessage message={errors?.name?.message} />}
                    </div>
                    <div className="relative mb-5">
                        <Input
                            type="email"
                            placeholder="Email Address"
                            {...register("email")}
                            className={`h-13 rounded-sm text-black border-gray-300 ${errors?.email && "border-red-500 focus:border-red-500"}`}
                        />
                        {errors?.email && <ToolTipMessage message={errors?.email?.message} />}
                    </div>
                    <div className="relative mb-5">
                        <Input
                            type="tel"
                            placeholder="Phone Number"
                            {...register("phone")}
                            className={`h-13 rounded-sm text-black border-gray-300 ${errors?.phone && "border-red-500 focus:border-red-500"}`}
                        />
                        {errors?.phone && <ToolTipMessage message={errors?.phone?.message} />}
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
                    <p className="text-sm text-center mb-3">
                        Already have an account?{" "}
                        <Link
                            to="/login"
                            className="font-semibold">
                            Login
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
                            "Sign Up"
                        )}
                    </Button>
                    <p className="text-[#686b78] text-center text-sm mt-3">By clicking on Signup, I accept the Terms & Conditions & Privacy Policy</p>
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

export default Signup;
