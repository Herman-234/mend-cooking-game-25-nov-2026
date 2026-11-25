// Sizzle Station — menu data: the ingredients on the counter and the dishes
// customers order. Recipes are the game's own invention, not a real menu.
export const INGREDIENTS = [
  { id: 'bun',     name: 'Bun',     key: '1', color: '#e8b96a', price: 2 },
  { id: 'patty',   name: 'Patty',   key: '2', color: '#8a5a2b', price: 4 },
  { id: 'cheese',  name: 'Cheese',  key: '3', color: '#f5c542', price: 3 },
  { id: 'lettuce', name: 'Lettuce', key: '4', color: '#58b368', price: 2 },
  { id: 'tomato',  name: 'Tomato',  key: '5', color: '#e05252', price: 2 },
  { id: 'onion',   name: 'Onion',   key: '6', color: '#b388e0', price: 2 },
];

export const RECIPES = [
  { name: 'Classic Burger', items: ['bun', 'patty', 'lettuce', 'tomato'], coins: 12 },
  { name: 'Cheese Melt',    items: ['bun', 'patty', 'cheese'],            coins: 10 },
  { name: 'Garden Stack',   items: ['bun', 'lettuce', 'tomato', 'onion', 'cheese'], coins: 14 },
  { name: 'Double Trouble', items: ['bun', 'patty', 'patty', 'cheese'],  coins: 16 },
  { name: 'Veggie Delight', items: ['bun', 'lettuce', 'tomato', 'onion'], coins: 11 },
];

export const GAME_LENGTH = 150;    // seconds in one shift
export const ORDER_PATIENCE = 40;  // seconds before a customer walks out
export const GRILL_TIME = 5;       // seconds to cook a patty
export const MAX_HEARTS = 3;
export const MAX_ORDERS = 3;

export function ingredientById(id) {
  return INGREDIENTS.find((item) => item.id === id);
}
