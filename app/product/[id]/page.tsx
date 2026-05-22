import { notFound } from "next/navigation";
import { ProductDetailsPage } from "@/components/ProductDetailsPage";
import { menuItems } from "@/data/products";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product = menuItems.find((item) => item.id === Number(id));

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage product={product} />;
}
