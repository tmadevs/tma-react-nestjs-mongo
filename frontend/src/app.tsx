import { Route, Routes } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import {
  bindMiniAppCSSVars,
  bindThemeParamsCSSVars,
  useMiniApp,
  useThemeParams,
} from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import { Toaster } from "~/components/ui/toaster";
import { MainPage } from "./pages/home/page";
import { useTheme } from "./providers/shadcn-provider";

function App() {
  useAuth();

  const theme = useTheme();
  const themeParams = useThemeParams();
  const miniApp = useMiniApp();

  useEffect(() => {
    return bindMiniAppCSSVars(miniApp, themeParams);
  }, [miniApp, themeParams]);

  useEffect(() => {
    theme.setTheme(themeParams.isDark ? "dark" : "light");
    miniApp.setHeaderColor(themeParams.isDark ? "#000000" : "#ffffff");
    return bindThemeParamsCSSVars(themeParams);
  }, [themeParams]);

  useEffect(() => {
    document.documentElement.classList.add("twa");
    miniApp.ready();
    miniApp.requestWriteAccess();
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
