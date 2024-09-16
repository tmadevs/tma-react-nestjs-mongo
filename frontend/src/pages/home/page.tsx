import { useEffect } from "react";
import { useBackButton } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import Logo from "~/assets/logo.svg";
import { LanguageSwitcher } from "~/components/languge-switcher";
import { ThemeSwitcher } from "~/components/theme-switcher";

export const MainPage = () => {
  const bb = useBackButton();
  const { t } = useTranslation();

  useEffect(() => {
    if (bb) {
      bb.hide();
    }
  }, [bb]);

  return (
    <div className="h-dvh flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center gap-2">
        <img src={Logo} alt="@tmadevs" />
        <span className="font-bold">@tmadevs</span>
        <h1 className="font-display font-bold text-4xl">{t("hello_world")}</h1>
        <p>
          {t('created_by')}{" "}
          <a href="https://t.me/tmadevs" target="_blank" className="underline text-sky-600 dark:text-sky-400">
            @tmadevs
          </a>
        </p>
      </main>

      <footer className="flex justify-center items-center p-4 gap-4">
        <LanguageSwitcher />
        <ThemeSwitcher />
      </footer>
    </div>
  );
};
