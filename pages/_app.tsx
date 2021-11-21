import "../styles/globals.scss";
import "antd/dist/antd.css";
import "../styles/tourism.scss";
import "../styles/bike.scss";
import "@fortawesome/fontawesome-svg-core/styles.css";
// Prevent fontawesome from adding its CSS since we did it manually above:
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false; /* eslint-disable import/first */

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;
