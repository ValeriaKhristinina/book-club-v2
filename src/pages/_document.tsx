import { createGetInitialProps } from '@mantine/next';
import Document, { Head, Html, Main, NextScript } from 'next/document';
import { ClerkProvider } from '@clerk/nextjs'

const getInitialProps = createGetInitialProps();

export default class _Document extends Document {
  static getInitialProps = getInitialProps;

  render() {
    return (
      <Html>
        <Head />
        <ClerkProvider>
          <body>
            <Main />
            <NextScript />
          </body>
        </ClerkProvider>
      </Html>
    );
  }
}