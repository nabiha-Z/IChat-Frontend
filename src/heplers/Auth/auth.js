import { signout } from "@/api";
import { toastError } from "@/components/Toast/toast";
import Cookies from "js-cookie";
import { useRouter } from "next/router";

export const logout = async () => {
  const router = useRouter();
  await signout()
    .then((data) => {
      Cookies.remove("token");
      router.push("/Auth/login");
    })
    .catch((err) => {
      toastError(err.message);
    });
};
