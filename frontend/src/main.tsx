import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { TmaProvider } from "./providers/tma-provider.tsx";
import App from "./app.tsx";
import { QueryProvider } from "./providers/query-provider.tsx";

import "./globals.css";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18n.ts";
import { ThemeProvider } from "./providers/shadcn-provider.tsx";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { config } from "./config.ts";

export const Root = () => {
  return (
    <BrowserRouter>
      <TonConnectUIProvider
        manifestUrl={`https://tmadevs.com/tonconnect-manifest.json`}
        actionsConfiguration={{
          twaReturnUrl: `https://t.me/${config.botName}/onboarding`,
        }}
      >
        <ThemeProvider defaultTheme="system" storageKey="shadcn-ui-theme">
          <QueryProvider>
            <TmaProvider>
              <I18nextProvider i18n={i18n}>
                <App />
              </I18nextProvider>
            </TmaProvider>
          </QueryProvider>
        </ThemeProvider>
      </TonConnectUIProvider>
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Root />);
