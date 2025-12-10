export type Product = {
  id: string
  title: string
  price: number
  image: string
  description?: string
  brand?: string
  age_group?: string
  stock?: number
  category?: string
  slug?: string
  created_at?: string
  rating?: number
}

export const products: Product[] = [
  { 
    id: 'k1', 
    title: 'Kit Fantasia Brilhante', 
    price: 129.90, 
    image: 'kids/fantasia-brilhante.svg',
    category: 'Roupas',
    age_group: '3-6 anos',
    rating: 4.8,
    slug: 'kit-fantasia-brilhante',
    description: 'Transforme o dia em magia com esta capa cintilante e acessórios encantados.'
  },
  { 
    id: 'k2', 
    title: 'Carrinho Turbo Arco-íris', 
    price: 89.90, 
    image: 'kids/turbo-arcoiris.svg',
    category: 'Brinquedos',
    age_group: '2-5 anos',
    rating: 4.5,
    slug: 'carrinho-turbo-arcoiris',
    description: 'Velocidade e cores vibrantes para as corridas mais divertidas da sala.'
  },
  { 
    id: 'k3', 
    title: 'Kit Arte Mágica', 
    price: 59.90, 
    image: 'kids/arte-magica.svg',
    category: 'Educativo',
    age_group: '4-8 anos',
    rating: 4.9,
    slug: 'kit-arte-magica',
    description: 'Tudo o que o pequeno artista precisa: tintas laváveis, pincéis e muita imaginação.'
  },
  { 
    id: 'k4', 
    title: 'Luminária Estrelada', 
    price: 149.90, 
    image: 'kids/luz-estrelada.svg',
    category: 'Decoração',
    age_group: 'Todas',
    rating: 4.7,
    slug: 'luminaria-estrelada',
    description: 'Projeta um céu estrelado no teto do quarto para noites de sono tranquilas.'
  },
  { 
    id: 'k5', 
    title: 'Blocos ABC Alegria', 
    price: 79.90, 
    image: 'kids/abc-alegria.svg',
    category: 'Educativo',
    age_group: '1-3 anos',
    rating: 5.0,
    slug: 'blocos-abc-alegria',
    description: 'Aprender o alfabeto nunca foi tão divertido com estes blocos coloridos e macios.'
  },
  { 
    id: 'k6', 
    title: 'Pelúcia Dino Fofinho', 
    price: 99.90, 
    image: 'kids/dino-fofinho.svg',
    category: 'Pelúcias',
    age_group: '0+ anos',
    rating: 4.9,
    slug: 'pelucia-dino-fofinho',
    description: 'O melhor amigo para abraços, feito de material hipoalergênico e super macio.'
  },
  { 
    id: 'k7', 
    title: 'Mochila Super Herói', 
    price: 119.90, 
    image: 'kids/mochila-heroi.svg',
    category: 'Acessórios',
    age_group: '4-10 anos',
    rating: 4.6,
    slug: 'mochila-super-heroi',
    description: 'Espaço para todos os cadernos e um design que dá superpoderes na escola.'
  },
  { 
    id: 'k8', 
    title: 'Puzzle Arco-íris 500', 
    price: 69.90, 
    image: 'kids/puzzle-arcoiris.svg',
    category: 'Jogos',
    age_group: '6+ anos',
    rating: 4.4,
    slug: 'puzzle-arcoiris-500',
    description: 'Um desafio colorido para montar em família e decorar a parede depois.'
  }
]
