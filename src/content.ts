// Todo o conteúdo do site fica aqui. Marca, endereço e pessoas são fictícios.

export type Category = 'bolos' | 'donuts' | 'doces' | 'tortas'

export type Product = {
  name: string
  description: string
  price: string
  image: string
  category: Category
  tag?: string
}

export const site = {
  name: 'Doce Aurora',
  fullName: 'Doce Aurora Confeitaria',
  since: 2012,
  city: 'Aurora do Vale, MG',
  // Número fictício: o link abre o WhatsApp só para demonstrar o fluxo.
  whatsapp: '5538900000000',
  phone: '(38) 9 0000-0000',
  email: 'ola@doceaurora.exemplo',
  instagram: '@doceaurora.confeitaria',
  author: { name: 'Felipe Santos', url: 'https://felipesan.com.br/' },
}

export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'vitrine', label: 'Vitrine' },
  { id: 'sobre', label: 'Sobre' },
  { id: 'cardapio', label: 'Cardápio' },
  { id: 'visite', label: 'Visite' },
]

export const hero = {
  eyebrow: 'Confeitaria artesanal · desde 2012',
  titleTop: 'Doces que',
  titleAccent: 'derretem',
  titleBottom: 'corações',
  text: 'Bolos de andar, drip cakes, donuts recheados e macarons feitos à mão todos os dias, com ingredientes frescos e receitas de família.',
  primary: 'Fazer encomenda',
  secondary: 'Ver cardápio',
}

export const highlights = [
  { icon: 'cake', title: 'Receitas de família', text: 'Massas fofinhas e recheios trufados que passam de geração em geração.' },
  { icon: 'leaf', title: 'Ingredientes frescos', text: 'Frutas da estação, chocolate belga e manteiga de verdade, sem atalhos.' },
  { icon: 'sun', title: 'Feito no dia', text: 'A vitrine é montada toda manhã. O que sobra vira doação no fim da tarde.' },
  { icon: 'gift', title: 'Do seu jeito', text: 'Bolos personalizados para aniversários, casamentos e chás de bebê.' },
] as const

export const products: Product[] = [
  {
    name: 'Drip cake de morango',
    description: 'Massa branca, brigadeiro de morango e ganache rosa escorrendo.',
    price: 'R$ 189',
    image: 'bolo-rosa',
    category: 'bolos',
    tag: 'Mais pedido',
  },
  {
    name: 'Bolo vitrine de morango',
    description: 'Pão de ló, chantilly fresco e morangos inteiros.',
    price: 'R$ 129',
    image: 'bolo-morango',
    category: 'bolos',
  },
  {
    name: 'Torre de macarons',
    description: '42 macarons em degradê, perfeita para mesa de festa.',
    price: 'R$ 249',
    image: 'torre-macarons',
    category: 'doces',
    tag: 'Festa',
  },
  {
    name: 'Donut de morango',
    description: 'Massa brioche, glaçado de morango e granulado colorido.',
    price: 'R$ 12',
    image: 'donut-morango',
    category: 'donuts',
  },
  { name: 'Cupcakes confete', description: 'Baunilha com buttercream rosa e chuva de confeitos.', price: 'R$ 9', image: 'cupcakes-pastel', category: 'doces' },
  {
    name: 'Cheesecake de cereja',
    description: 'Base de cookie de chocolate e calda de cereja azedinha.',
    price: 'R$ 18',
    image: 'cheesecake',
    category: 'tortas',
  },
  { name: 'Floresta negra', description: 'Três camadas de chocolate, creme e cerejas ao licor.', price: 'R$ 159', image: 'bolo-chocolate', category: 'bolos' },
  {
    name: 'Macarons da casa',
    description: 'Pistache, framboesa, baunilha e limão siciliano.',
    price: 'R$ 7',
    image: 'macarons',
    category: 'doces',
    tag: 'Novo',
  },
  {
    name: 'Tortinha de frutas',
    description: 'Massa sablé, creme de confeiteiro e frutas vermelhas.',
    price: 'R$ 16',
    image: 'torta-frutas',
    category: 'tortas',
  },
  { name: 'Donuts jardim', description: 'Glaçados com frutas frescas e flores comestíveis.', price: 'R$ 14', image: 'donuts-sortidos', category: 'donuts' },
  { name: 'Cupcakes de menta', description: 'Chocolate com cobertura de menta e granulado.', price: 'R$ 9', image: 'cupcakes', category: 'doces' },
  { name: 'Cookies da vovó', description: 'Massa amanteigada com pedaços de chocolate e flor de sal.', price: 'R$ 8', image: 'cookies', category: 'tortas' },
  {
    name: 'Bolo festa rosa',
    description: 'Naked cake de baunilha e frutas vermelhas, até 30 fatias.',
    price: 'R$ 219',
    image: 'bolo-aniversario',
    category: 'bolos',
  },
  { name: 'Trio de donuts rosa', description: 'Três donuts recheados com doce de leite.', price: 'R$ 32', image: 'donuts-rosa', category: 'donuts' },
]

export const categories: { id: Category | 'todos'; label: string }[] = [
  { id: 'todos', label: 'Todos' },
  { id: 'bolos', label: 'Bolos' },
  { id: 'donuts', label: 'Donuts' },
  { id: 'doces', label: 'Doces finos' },
  { id: 'tortas', label: 'Tortas & cookies' },
]

export const about = {
  eyebrow: 'Nossa história',
  title: 'Desde 2012 adoçando Aurora do Vale',
  paragraphs: [
    'A Doce Aurora começou na cozinha de casa, com a confeiteira Helena Prado vendendo bolos de pote para os vizinhos. A procura cresceu e, em 2012, a primeira vitrine abriu na Rua das Camélias.',
    'Hoje somos uma equipe de doze confeiteiros, mas o jeito de fazer continua o mesmo: massa batida na hora, recheio generoso e cobertura que escorre do jeito certo.',
  ],
  specialty: {
    title: 'Nossa especialidade',
    text: 'Drip cakes e bolos de andar com recheios trufados, montados à mão para cada festa.',
  },
  stats: [
    { value: 12, suffix: '+', label: 'anos de vitrine' },
    { value: 40, suffix: ' mil', label: 'bolos entregues' },
    { value: 4.9, suffix: '', label: 'nota dos clientes', decimals: 1 },
  ],
}

export const location = {
  address: 'Rua das Camélias, 128 · Centro',
  city: 'Aurora do Vale, MG · 39999-000',
  // Ponto ilustrativo no mapa: a confeitaria e o endereço não existem.
  coords: [-21.1106, -44.1786] as [number, number],
  hours: [
    { days: 'Terça a sexta', time: '9h às 19h', open: [2, 3, 4, 5], from: 9, to: 19 },
    { days: 'Sábado', time: '9h às 18h', open: [6], from: 9, to: 18 },
    { days: 'Domingo', time: '9h às 13h', open: [0], from: 9, to: 13 },
    { days: 'Segunda', time: 'Fechado', open: [], from: 0, to: 0 },
  ],
}

export const credits = 'Projeto fictício de portfólio.'
