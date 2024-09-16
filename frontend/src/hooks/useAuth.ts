import { useLaunchParams } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { config } from "~/config";
import { useAuthStore } from "~/db/authStore";
import { useUserStore } from "~/db/userStore";

export const useAuth = () => {
  const setUser = useUserStore((state) => state.setUser);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const { initData, initDataRaw } = useLaunchParams();

  useEffect(() => {
    
    if (initData?.user) {
      localStorage.removeItem("accessToken");

      fetch(`${config.apiUrl}/api/auth/sync`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          initDataRaw,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("accessToken", data.accessToken);
          window.dispatchEvent(new Event("storage"));
          setUser(data.user);
          setAccessToken(data.accessToken);
        })
        .catch((error) => {
          console.error("Sync error:", error);
        });
    }
  }, [initData, setUser, initDataRaw, setAccessToken]);
};
