export default function TemplateShop({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="shop-template-wrapper" suppressHydrationWarning>{children}</div>;
}
