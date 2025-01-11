import type { AppProps } from "next/app";
import "../styles/globals.css"; // Import Tailwind CSS styles

export default function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}