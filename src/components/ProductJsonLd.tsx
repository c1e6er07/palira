export default function ProductJsonLd({ product }: { product: { id: string; title: string; price: number; image: string; description?: string } }) {
  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    name: product.title,
    image: product.image,
    description: product.description ?? '',
    offers: {
      '@type': 'Offer',
      priceCurrency: 'BRL',
      price: String(product.price),
      availability: 'https://schema.org/InStock'
    }
  }
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
}
