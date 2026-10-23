import KolomCatatan from "../components/KolomCatatan";

export default function TemplateShop({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="shop-template-wrapper">
      <div className="page-container pb-2">
        <KolomCatatan label="Catatan di template (Uji Reset State)" />
      </div>
      {children}
    </div>
  );
}
