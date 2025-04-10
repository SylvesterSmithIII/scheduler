// app/layout.js
import "./globals.css";
import { Providers } from "./providers";

export const metadata = {
  title: "Scheduler App",
  description: "My Scheduler Application",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}