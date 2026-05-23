import { notFound } from "next/navigation";
import { ProductDetailsPage } from "@/components/ProductDetailsPage";
import { getProductById } from "@/utils/products";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { id } = await params;
  const product = await getProductById(id);

  if (!product) {
    notFound();
  }

  return <ProductDetailsPage product={product} />;
}
