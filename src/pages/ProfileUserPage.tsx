import { ProfileUser } from "../components/organisms/ProfileUser";
import Header from "../components/organisms/Header";
import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const ProfileUserPage: React.FC = () => {
    const queryClient = new QueryClient();
    useEffect(() => {
        // Scroll to the top when the component mounts
        window.scrollTo(0, 0);
    }, []);
    return (
        <QueryClientProvider client={queryClient}>
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <Header />

            {/* Main Content */}
            <main className="flex-1 pt-8"> {/* pt-16 adds padding-top equal to 4rem, adjust if needed */}
                <ProfileUser />
            </main>
        </div>
        </QueryClientProvider>
    );
}

export default ProfileUserPage


