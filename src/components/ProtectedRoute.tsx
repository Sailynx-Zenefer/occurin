import { Redirect, router } from "expo-router";
import { useAuth } from "../hooks/Auth";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: any) => {
  const { user } = useAuth();
  if (!user) {
    // user is not authenticated
    return <Redirect href={"/sign-in"} />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
