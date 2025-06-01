import { Redirect, router } from "expo-router";
import { useAppSelector } from "@/src/redux/hooks";

export default function Index() {
  const { isFirstTimeUser, isAuthenticated, user, loading } = useAppSelector((state) => state.auth);
  console.log('isAuthenticated', isAuthenticated);

  if (!isAuthenticated) {
    console.log('isFirstTimeUser', isFirstTimeUser);
    
    if (isFirstTimeUser) {
      return <Redirect href="/onboarding" />;
      // return <Redirect href={"/onboarding"} />;
    } else {
      return <Redirect href="/sign-in" />;
      // return <Redirect href={"/sign-in"} />;
    }
  } else {
    return <Redirect href="/(tabs)/(home)/" />
  }
}
