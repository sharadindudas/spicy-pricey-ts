import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToolTipMessage from "@/components/common/ToolTipMessage";
import { LoaderCircle, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoginSchema, LoginSchemaType } from "@/schemas/authSchema";
import useLogin from "@/hooks/useLogin";
import { setStateBooleanType } from "@/types/types";

interface LoginFormProps {
    setIsSidebarOpen: setStateBooleanType;
}

const LoginForm = ({ setIsSidebarOpen }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState<boolean>(false);

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
            <form
                noValidate
                onSubmit={handleSubmit(onLogin)}
                className="space-y-3">
                <div className="relative">
                    <Input
                        type="text"
                        placeholder="Email or Phone Number"
                        {...register("identity")}
                        className={`h-13 rounded-sm text-black border-gray-300 ${errors?.identity && "border-red-500 focus:border-red-500"}`}
                    />
                    {errors?.identity && <ToolTipMessage message={errors?.identity?.message} />}
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
                            "Log In"
                        )}
                    </Button>
                </div>
            </form>
            <p className="text-[#686b78] text-center text-sm">By clicking on Login, I accept the Terms & Conditions & Privacy Policy</p>
        </>
    );
};

export default LoginForm;
