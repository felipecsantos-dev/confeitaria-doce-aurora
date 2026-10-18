# Doce Aurora – Confeitaria

Site de uma confeitaria **fictícia**, feito para o meu portfólio. Tem um donut 3D interativo no hero, coberturas que "derretem" entre as seções conforme a página rola, vitrine em carrossel, cardápio com filtros e mapa de localização.

> **Projeto de estudo.** A marca, o endereço, os telefones e as pessoas citadas são inventados. Desenvolvido com apoio do Claude Code.

## Seções

Início (donut 3D) · Diferenciais · Vitrine (carrossel) · Sobre · Cardápio · Visite (mapa) · Encomendas · Rodapé

## Tecnologias e recursos

- **Vite + React 19 + TypeScript**
- **Tailwind CSS 4** com a paleta definida em variáveis de tema (rosa e menta)
- **Three.js com React Three Fiber e drei**: donut modelado direto no código (massa, cobertura com gotas escorrendo e 300 granulados instanciados). Gira com o mouse, pode ser arrastado e para de renderizar fora da tela
- **GSAP (ScrollTrigger e Flip)**: título com letras subindo, gotas de calda que crescem com a rolagem, parallax, contadores e a animação de troca dos filtros do cardápio
- **Lenis**: rolagem suave sincronizada com o GSAP
- **Embla Carousel**: vitrine com roda do mouse/trackpad, setas, arrastar e teclado
- **Leaflet**: mapa carregado só quando a seção se aproxima da tela
- Efeitos de hover (botões com "calda" subindo, cartões com inclinação 3D, cursor personalizado) e foco visível em todos os elementos interativos
- Acessibilidade: link "pular para o conteúdo", `aria` no carrossel e nos filtros, contraste revisado e animações desligadas para quem prefere movimento reduzido
- SEO: meta tags, Open Graph e JSON-LD (`Bakery`)
- Todo o conteúdo fica em um único arquivo (`src/content.ts`)

## Paleta

| Cor | Hex | Uso |
| --- | --- | --- |
| Rosa | `#F2709C` | coberturas, destaques |
| Rosa escuro | `#D13A70` | botões e textos sobre branco |
| Menta | `#8EDFD9` | fundo do hero |
| Menta claro | `#E6F8F6` | fundos de seção e ícones |
| Grafite | `#23303B` | textos |

## Como rodar

```bash
npm install
npm run dev
```

Depois abra http://localhost:5173 no navegador. Para gerar a versão de produção: `npm run build`.

## Créditos das fotos

Todas as fotos são do [Unsplash](https://unsplash.com) e usam a licença gratuita. Os autores são Heather Barnes, Joshua Glass, Deva Williamson, Chelsea Audibert, Ahmad Fraz, Brooke Lark, Elena Koycheva, the frosted cake studio, Yulia Khlebnikova, Jacob Thomas, Oliver-Timm Haarmann, Jennifer Pallian, tommao wang, Sobolev Maksim e LuAnn Hunt.

Mapa: blocos © Esri, biblioteca Leaflet.

## Autor

**Felipe Santos**, estudante de Análise e Desenvolvimento de Sistemas e desenvolvedor front-end em formação.
Portfólio: [felipesan.com.br](https://felipesan.com.br/) · GitHub: [@felipecsantos-dev](https://github.com/felipecsantos-dev)
