import { StoreChrome } from "@/components/store/StoreChrome";

export default function StoreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <StoreChrome>{children}</StoreChrome>;
}
