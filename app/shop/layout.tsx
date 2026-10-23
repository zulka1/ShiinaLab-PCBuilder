import KolomCatatan from "../components/KolomCatatan";

export default function LayoutShop({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shop-layout-wrapper">
      <div className="page-container pt-4">
        <KolomCatatan label="Catatan di layout (Uji Retensi State)" />
      </div>
      {children}
    </div>
  );
}
