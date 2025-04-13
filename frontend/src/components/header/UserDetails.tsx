import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import useLogout from "@/hooks/useLogout";
import { User } from "@/types/types";
import { UserRound } from "lucide-react";

const UserDetails = ({ user }: { user: User }) => {
    const { handleLogout } = useLogout();

    const onLogout = async () => {
        await handleLogout();
    };

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 cursor-pointer orange-hover font-medium">
                    <UserRound className="w-5" />
                    <span>{user?.name}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="min-w-[10rem]">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer pb-2">
                        Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer pb-2">
                        Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={onLogout}
                        className="cursor-pointer pb-2"
                    >
                        Logout
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};

export default UserDetails;
