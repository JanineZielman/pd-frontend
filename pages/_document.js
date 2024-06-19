import Document, { Html, Head, Main, NextScript } from "next/document"

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <script src="https://code.jquery.com/jquery-3.7.1.js"></script>
          <script src="https://code.jquery.com/ui/1.13.3/jquery-ui.js"></script>
          <script src="/jquery.ui.touch-punch.min.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
