import { RevenueCatProvider } from "@/components/RevenueCatProvider";

export default function StoreLayout({ children }) {
  return <RevenueCatProvider>{children}</RevenueCatProvider>;
}
