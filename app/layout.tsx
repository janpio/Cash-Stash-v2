import "./globals.css";
import { Roboto } from "next/font/google";
import { Providers as ChakraUIProviders } from "./providers";
import { Providers as ReduxProviders } from "@/app/redux/provider";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "@/components/theme-provider";
import GenericConfirmDialog from "@/components/GenericConfirmDialog";
import GenericModal from "@/components/GenericModal";

const RobotoFont = Roboto({
  weight: ["300", "400", "700"],
  subsets: ["latin"],
});

export const metadata = {
  title: "Cash Stash | Personal Finance",
  description:
    "Minimalist personal finance app. Track your spending, set a budget, and save more.",
};

interface ILayoutProps {
  children: React.ReactNode;
}

export default async function RootLayout({ children }: ILayoutProps) {
  return (
    <html lang="en">
      <body className={RobotoFont.className}>
        <ReduxProviders>
          <ChakraUIProviders>
            <ThemeProvider enableSystem>
              {children}
              <GenericModal />
              <GenericConfirmDialog />
            </ThemeProvider>
          </ChakraUIProviders>
          <Toaster />
        </ReduxProviders>
      </body>
    </html>
  );
}
