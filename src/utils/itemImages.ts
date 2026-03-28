/**
 * Static lookup from item name → local asset path.
 * Images live in src/assets/food/ and are bundled by Vite at build time.
 * No network requests ever needed.
 */

// Vite requires static imports for assets to be bundled correctly.
import baconImg from '../assets/food/bacon.png';
import bananaImg from '../assets/food/banana.png';
import breadImg from '../assets/food/bread.png';
import butterImg from '../assets/food/butter.png';
import cakeImg from '../assets/food/cake.png';
import carrotImg from '../assets/food/carrot.png';
import cheeseImg from '../assets/food/cheese.png';
import chickenImg from '../assets/food/chicken.png';
import coffeeImg from '../assets/food/coffee.png';
import cookieImg from '../assets/food/cookie.png';
import eggsImg from '../assets/food/eggs.png';
import flourImg from '../assets/food/flour.png';
import icecreamImg from '../assets/food/icecream.png';
import ketchupImg from '../assets/food/ketchup.png';
import lettuceImg from '../assets/food/lettuce.png';
import mangoImg from '../assets/food/mango.png';
import milkImg from '../assets/food/milk.png';
import orangeImg from '../assets/food/orange.png';
import pastaImg from '../assets/food/pasta.png';
import potatoImg from '../assets/food/potato.png';
import saltImg from '../assets/food/salt.png';
import sausageImg from '../assets/food/sausage.png';
import steakImg from '../assets/food/steak.png';
import tomatoImg from '../assets/food/tomato.png';
import waterImg from '../assets/food/water.png';

export const ITEM_IMAGES: Record<string, string> = {
  "Bacon": baconImg,
  "Bananas": bananaImg,
  "Bread": breadImg,
  "Butter": butterImg,
  "Cake": cakeImg,
  "Carrots": carrotImg,
  "Cheese": cheeseImg,
  "Chicken": chickenImg,
  "Coffee": coffeeImg,
  "Cookies": cookieImg,
  "Eggs": eggsImg,
  "Flour": flourImg,
  "Ice Cream": icecreamImg,
  "Ketchup": ketchupImg,
  "Lettuce": lettuceImg,
  "Mango": mangoImg,
  "Milk": milkImg,
  "Oranges": orangeImg,
  "Pasta": pastaImg,
  "Potatoes": potatoImg,
  "Salt": saltImg,
  "Sausage": sausageImg,
  "Steak": steakImg,
  "Tomatoes": tomatoImg,
  "Water": waterImg,
};

/** Case-insensitive lookup. Returns the bundled asset URL or null. */
export function getItemImage(name: string): string | null {
  const key = Object.keys(ITEM_IMAGES).find(
    k => k.toLowerCase() === name.toLowerCase()
  );
  return key ? ITEM_IMAGES[key] : null;
}

/** Ordered list of all valid item names (matches ITEM_IMAGES keys). */
export const ITEM_NAMES = Object.keys(ITEM_IMAGES);
