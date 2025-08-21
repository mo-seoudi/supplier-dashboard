import { useEffect } from "react";
import { useRouter } from "next/router";

export default function Index() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/Dashboard");
  }, [router]);
  return null; // or a tiny loading spinner
}
