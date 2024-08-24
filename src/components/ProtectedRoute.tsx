import { Redirect } from "expo-router";
import { useAuth } from "../utils/Auth";

const ProtectedRoute = ({ children }: any) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Redirect href={"/sign-in"} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
