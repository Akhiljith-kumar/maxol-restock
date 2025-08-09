// src/seedData.js
export const defaultVariantState = () => ({
  check: false,
  count: 0,
  box: false,
  completed: false,
});

// Build the full initial dataset with brands → variants
export function buildSeedData() {
  const ds = defaultVariantState;

  return {
    can: {
      Pepsi: {
        regular: ds(),
        cherry: ds(),
        max: ds(),
      },
      'Coca-Cola': {
        regular: ds(),
        zero: ds(),
      },
      Lucozade: {
        regular: ds(),         // can
      },
      Club: {
        lemon: ds(),
        orange: ds(),
      },
      '7UP': {
        regular: ds(),
        zero: ds(),
        pink: ds(),
      },
      Boost: {
        blue: ds(),
        red: ds(),
        regular: ds(),
      },
      'Red Bull': {
        regular: ds(),
        large: ds(),
        blue: ds(),
        orange: ds(),
        zero: ds(),
      },
      'Energy Drink': {
        green: ds(),
        silver: ds(),
      },
      Monster: {
        'regular green': ds(),
        silver: ds(),
        mango: ds(),
        'cream soda': ds(),
        monarch: ds(),
        'ultra paradise green': ds(),
        'ultra fiesta turquoise': ds(),
        'full tropical': ds(),
        'max red': ds(),
      },
      Fanta: {
        blue: ds(),
        red: ds(),
        yellow: ds(),
      },
      'Coconut Water': {
        can: ds(),
      },
    },

    bottles: {
      Ballygowan: {
        'strawberry 500ml': ds(),
        'summer fruits 500ml': ds(),
        'still 500ml': ds(),
        'still 750ml': ds(),
        'apple 750ml': ds(),
        'summer fruits 750ml': ds(),
      },
      Volvic: {
        still: ds(),
        sparkling: ds(),
      },
      'Monster Max Water': {
        '500ml': ds(),
        '750ml': ds(),
      },
      Rockstar: {
        '500ml': ds(),
        sparkling: ds(),
        '750ml': ds(),
      },
      'Tipton Street': {
        'score 500ml': ds(),
        'sport 500ml': ds(),
        '750ml': ds(),
      },
      Pepsi: {
        'regular 750ml': ds(),
        'max 750ml': ds(),
      },
      Energy: {
        'glucose 750ml': ds(),
        'orange 750ml': ds(),
      },
      '7UP': {
        'regular 750ml': ds(),
        'zero 750ml': ds(),
        'regular 500ml': ds(),
        'zero 500ml': ds(),
      },
      Energise: {
        regular: ds(),
      },
      Orange: {
        small: ds(),
      },
      'Blueberry Drink': {
        '500ml': ds(),
      },
      Purdeys: {
        '500ml': ds(),
      },
      Tropical: {
        small: ds(),
      },
      Lucozade: {
        'original 330ml': ds(),
        'original 500ml': ds(),
        'sugar-free 330ml': ds(),
        'sugar-free 500ml': ds(),
        'orange 330ml': ds(),
        'orange 500ml': ds(),
        sport: ds(),
      },
      Boost: {
        'blue energy 500ml': ds(),
        'red energy 500ml': ds(),
        'blue sports 500ml': ds(),
        'red sports': ds(),
        'orange sports': ds(),
      },
      Vithit: {
        hits: ds(),
        green: ds(),
        mango: ds(),
      },
      'Capri Sun': {
        orange: ds(),
        grape: ds(), // “GL” assumed grape
      },
      Club: {
        'orange 500ml': ds(),
        'kickstart 500ml': ds(),
      },
      'Coca-Cola': {
        'regular 500ml': ds(),
        'diet 500ml': ds(),
        'zero 500ml': ds(),
      },
      Lipton: {
        'yellow label iced tea': ds(),
        'orange iced tea': ds(),
        'mango iced tea': ds(),
        'raspberry iced tea': ds(),
      },
    },

    bigBottles: {
      Orange: {
        big: ds(),
      },
      'Blueberry Drink': {
        big: ds(),
      },
      Purdeys: {
        big: ds(),
      },
    },
  };
}
