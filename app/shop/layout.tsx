export default function LayoutShop({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="shop-layout-wrapper" suppressHydrationWarning>{children}</div>;
}
