import {
  mockTelegramEnv,
  parseInitData,
  SDKProvider,
} from "@telegram-apps/sdk-react";
import { ReactNode } from "react";

if (import.meta.env.VITE_DEV_USER) {
  const initDataRaw = import.meta.env.VITE_DEV_USER;

  mockTelegramEnv({
    themeParams: {
      accentTextColor: "#0077cc",
      bgColor: "#dddddd",
      buttonColor: "#0077cc",
      buttonTextColor: "#ffffff",
      destructiveTextColor: "#ff4d4d",
      headerBgColor: "#f0f4f7",
      hintColor: "#99aabb",
      linkColor: "#0077cc",
      secondaryBgColor: "#e6f2ff",
      sectionBgColor: "#f0f4f7",
      sectionHeaderTextColor: "#0077cc",
      subtitleTextColor: "#666666",
      textColor: "#333333",
    },
    initData: parseInitData(initDataRaw),
    initDataRaw,
    version: "7.2",
    platform: "tdesktop",
  });
}

export const TmaProvider = ({ children }: { children: ReactNode }) => {
  return (
    <SDKProvider debug acceptCustomStyles>
      {children}
    </SDKProvider>
  );
};
