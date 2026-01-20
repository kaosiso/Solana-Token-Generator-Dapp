import { AppProps } from 'next/app';
import Head from 'next/head';
import { FC } from 'react';
import { ContextProvider } from 'contexts/ContextProvider';
import {AppBar} from 'components/AppBar';
import {Footer} from 'components/Footer';
import Notification from 'components/Notification';
import "../styles/globals.css";
// import "../styles/css/style.css";

require("@solana/wallet-adapter-react-ui/styles.css")
require("../styles/globals.css");



const App: FC<AppProps> = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>Solana Token Creator</title>
      </Head>

      <ContextProvider>
        <div className="bg-default-900 min-h-screen flex flex-col">
          <AppBar />
          <Notification />

          <main className="flex-1">
            <Component {...pageProps} />
          </main>

          <Footer />
        </div>
      </ContextProvider>

      {/* SCRIPTS */}
      <script src='assets/libs/preline/preline.js' ></script>
      <script src='assets/libs/swiper/swiper-bundle.min.js' ></script>
      <script src='assets/libs/gumshoejs/gumshoe.polyfill.min.js' ></script>
      <script src='assets/libs/lucide/umd/lucide.min.js' ></script>
      <script src='assets/libs/aos/aos.js' ></script>
      <script src='assets/js/swiper.js' ></script>
      <script src='assets/js/theme.js' ></script>


    </>
  );
};

export default App;
