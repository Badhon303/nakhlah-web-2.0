import HomeContent from "@/app/(dashboard)/components/HomeContents";
import ClientWrapper from "./ClientWrapper";

export default function HomePage() {
  return (
    <ClientWrapper>
      <HomeContent />
    </ClientWrapper>
  );
}