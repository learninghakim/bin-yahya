// Procedural textures as data URIs — no image assets needed.
const svg = (inner: string, size: number) =>
  `url("data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'>${inner}</svg>`,
  )}")`;

/** Fibrous paper grain, meant for mix-blend-mode: multiply. */
export const paperNoise = svg(
  `<filter id='p'><feTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='3' seed='4'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.55'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#p)'/>`,
  260,
);

/** Large soft blotches for aged paper. */
export const paperBlotch = svg(
  `<filter id='b'><feTurbulence type='fractalNoise' baseFrequency='0.012' numOctaves='2' seed='9'/><feColorMatrix type='saturate' values='0'/><feComponentTransfer><feFuncA type='table' tableValues='0 0.35'/></feComponentTransfer></filter><rect width='100%' height='100%' filter='url(#b)'/>`,
  600,
);

/** Chalk dust on the board, meant for mix-blend-mode: screen. */
export const chalkDust = svg(
  `<filter id='c'><feTurbulence type='fractalNoise' baseFrequency='0.55' numOctaves='2' seed='2'/><feColorMatrix type='matrix' values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 2.2 -1.25'/></filter><rect width='100%' height='100%' filter='url(#c)'/>`,
  300,
);

/** Film grain for the top overlay. */
export const filmGrain = svg(
  `<filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/></filter><rect width='100%' height='100%' filter='url(#n)' opacity='0.5'/>`,
  220,
);
