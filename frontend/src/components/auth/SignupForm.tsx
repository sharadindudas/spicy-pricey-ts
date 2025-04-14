import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToolTipMessage from "@/components/common/ToolTipMessage";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { SignupSchema, SignupSchemaType } from "@/schemas/authSchema";
import useSignup from "@/hooks/useSignup";
import { setStateBooleanType } from "@/types/types";

interface SignupFormProps {
    setIsLoginForm: setStateBooleanType;
}

const SignupForm = ({ setIsLoginForm }: SignupFormProps) => {
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

    const { isLoading, handleSignup } = useSignup(reset, setIsLoginForm);

    const onLogin = async (data: SignupSchemaType) => {
        await handleSignup(data);
    };

    return (
        <>
            <form
                noValidate
                onSubmit={handleSubmit(onLogin)}
                className="space-y-3">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Full Name"
                        {...register("name")}
                        className={`h-13 rounded-sm text-black border-gray-300 ${errors?.name && "border-red-500 focus:border-red-500"}`}
                    />
                    {errors?.name && <ToolTipMessage message={errors?.name?.message} />}
                </div>
                <div className="relative">
                    <Input
                        type="email"
                        placeholder="Email Address"
                        {...register("email")}
                        className={`h-13 rounded-sm text-black border-gray-300 ${errors?.email && "border-red-500 focus:border-red-500"}`}
                    />
                    {errors?.email && <ToolTipMessage message={errors?.email?.message} />}
                </div>
                <div className="relative">
                    <Input
                        type="tel"
                        placeholder="Phone Number"
                        {...register("phone")}
                        className={`h-13 rounded-sm text-black border-gray-300 ${errors?.phone && "border-red-500 focus:border-red-500"}`}
                    />
                    {errors?.phone && <ToolTipMessage message={errors?.phone?.message} />}
                </div>
                <div className="relative">
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
                <div>
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
                </div>
            </form>
            <p className="text-[#686b78] text-center text-sm">By clicking on Signup, I accept the Terms & Conditions & Privacy Policy</p>
        </>
    );
};

export default SignupForm;
