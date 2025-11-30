// Mock database with in-memory storage
interface User {
  id: string
  email: string
  password: string
  fullName: string
  createdAt: Date
}

interface Product {
  id: string
  title: string
  author: string
  price: number
  description: string
  image: string
  stock: number
}

interface Order {
  id: string
  userId: string
  items: Array<{ productId: string; quantity: number; price: number }>
  total: number
  status: "pending" | "completed" | "cancelled"
  createdAt: Date
}

interface CartItem {
  productId: string
  quantity: number
}

// In-memory storage
export const db = {
  users: new Map<string, User>(),
  products: new Map<string, Product>(),
  orders: new Map<string, Order>(),
  carts: new Map<string, CartItem[]>(),
  resetTokens: new Map<string, { email: string; expiresAt: Date }>(),
}

// Sample products
export function initializeProducts() {
  const sampleProducts: Product[] = [
    {
      id: "1",
      title: "The Great Gatsby",
      author: "F. Scott Fitzgerald",
      price: 12.99,
      description: "A classic tale of ambition and the American Dream in the Jazz Age.",
      image: "/book-great-gatsby.jpg",
      stock: 50,
    },
    {
      id: "2",
      title: "To Kill a Mockingbird",
      author: "Harper Lee",
      price: 14.99,
      description: "A gripping tale of racial injustice and childhood innocence.",
      image: "/book-mockingbird.jpg",
      stock: 40,
    },
    {
      id: "3",
      title: "1984",
      author: "George Orwell",
      price: 13.99,
      description: "A dystopian novel about totalitarianism and surveillance.",
      image: "/book-1984.jpg",
      stock: 45,
    },
    {
      id: "4",
      title: "Pride and Prejudice",
      author: "Jane Austen",
      price: 11.99,
      description: "A romantic novel of wit, social commentary, and timeless love.",
      image: "/book-pride-prejudice.jpg",
      stock: 55,
    },
    {
      id: "5",
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      price: 13.99,
      description: "A story of teenage rebellion and alienation in post-war America.",
      image: "/book-catcher-rye.jpg",
      stock: 35,
    },
    {
      id: "6",
      title: "Brave New World",
      author: "Aldous Huxley",
      price: 14.99,
      description: "A futuristic society controlled through pleasure and conditioning.",
      image: "/book-brave-new-world.jpg",
      stock: 42,
    },
  ]

  sampleProducts.forEach((product) => {
    db.products.set(product.id, product)
  })
}

// Initialize products on module load
initializeProducts()
