import '~/styles/global.scss';
import { AnimateSharedLayout } from 'framer-motion';
import NProgress from 'nprogress';
import Router from 'next/router';

import { LanguageProvider } from '~/context/language-context';
import ThemeManager from '~/theme';
import { KmbProvider } from '~/context/kmb-context';

Router.events.on('routeChangeStart', () => NProgress.start());
Router.events.on('routeChangeComplete', () => NProgress.done());
Router.events.on('routeChangeError', () => NProgress.done());

const App = ({ Component, pageProps }) => {
  return (
    <AnimateSharedLayout>
      <ThemeManager>
        <LanguageProvider lang={pageProps.localization?.locale}>
          <KmbProvider>
            <Component {...pageProps} />
          </KmbProvider>
        </LanguageProvider>
      </ThemeManager>
    </AnimateSharedLayout>
  );
};

export default App;
