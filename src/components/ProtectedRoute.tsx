import { router } from "expo-router";
import { useAuth } from "../hooks/Auth";

const ProtectedRoute = ({ children }: any) => {
    const { user } = useAuth()

    if (!user) {
        // user is not authenticated
        return <>{router.replace('/sign-in')}</>;
    }
    return <>{children}</>
};

export default ProtectedRoute