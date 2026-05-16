// data.js — Food data array: SOLE SOURCE for all pages
const foodItems = [
  { id: 1,  name: "Classic Cheeseburger",   price: 299, image: "assets/classic-cheeseburger.jpg",    category: "Burgers"  },
  { id: 2,  name: "Chicken Biryani",         price: 379, image: "assets/Biryani.jpg",                 category: "Rice"     },
  { id: 3,  name: "Margherita Pizza",        price: 499, image: "assets/pizza.jpg",                   category: "Pizza"    },
  { id: 4,  name: "Spicy Chicken Wings",     price: 399, image: "assets/Spicychicken-wings.jpg",      category: "Snacks"   },
  { id: 5,  name: "Grilled Chicken Burger",  price: 329, image: "assets/grilledchicken-burger.jpg",   category: "Burgers"  },
  { id: 6,  name: "Chocolate Milkshake",     price: 199, image: "assets/Chocolate-Milkshakes.jpg",    category: "Drinks"   },
  { id: 7,  name: "Tandoori Chicken",        price: 449, image: "assets/tandoori-chicken.jpg",        category: "Grills"   },
  { id: 8,  name: "Cold Coffee",             price: 179, image: "assets/cold-coffee.jpg",             category: "Drinks"   },
  { id: 9,  name: "Cheese Sandwich",         price: 159, image: "assets/cheeses-sandwich.jpg",        category: "Snacks"   },
  { id: 10, name: "Momos",                   price: 199, image: "assets/momos.jpg",                   category: "Snacks"   },
  { id: 12, name: "Paneer Tikka",            price: 359, image: "assets/paneer-tikka.jpg",             category: "Rice"     },
  { id: 11, name: "Creamy Pasta",            price: 399, image: "assets/creamy-pasta.jpg",             category: "Pasta"    }
];

// Persist admin edits in localStorage
function getFoodItems() {
  const stored = localStorage.getItem("foodItems");
  return stored ? JSON.parse(stored) : foodItems;
}

function saveFoodItems(items) {
  localStorage.setItem("foodItems", JSON.stringify(items));
}
