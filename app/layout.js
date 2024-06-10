import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "GTPGenius",
  description:
    "GPTGenius: Your AI language companion. Powered by OpenAI, it enhances your conversations, content creation, and more!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="winter">
      <ClerkProvider>
        <body className={inter.className} suppressHydrationWarning>
          <Providers>{children}</Providers>
        </body>
      </ClerkProvider>
    </html>
  );
}
