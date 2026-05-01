import { TopNav } from "@/components/marketing/top-nav";
import { Footer } from "@/components/marketing/footer";
import { TelegramButton } from "@/components/marketing/telegram-button";

/**
 * Public layout — same chrome as the (marketing) route group, used for
 * pages that need to be publicly accessible but live outside marketing
 * (e.g. /risk-disclosure read-only view).
 */
export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav />
      <main id="main">{children}</main>
      <Footer />
      <TelegramButton />
    </>
  );
}
