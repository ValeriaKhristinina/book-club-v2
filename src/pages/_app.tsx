import { type AppType, type AppProps } from "next/app";
import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { api } from "~/utils/api";

import "~/styles/globals.css";
import AuthContextProvider from "~/context/auth-context";

const MyApp: AppType = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <title>Book Club</title>
        <meta
          name="description"
          content="Online Book club for managing meetings, discussies and members 📚"
        />
        <link rel="icon" href="/favicon-96x96.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
      </Head>

      <MantineProvider
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */
          colorScheme: "light"
        }}
      >
        <AuthContextProvider>
          <Component {...pageProps} />
        </AuthContextProvider>
      </MantineProvider>
    </>
  );
};

export default api.withTRPC(MyApp);
