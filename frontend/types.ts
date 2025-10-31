// types.ts
// Generated from PostgreSQL schema
// Represents entities for a Vinted-like marketplace app

// Database types (prefixed with Db to avoid conflicts with frontend types)
export interface DbUser {
  id: number
  full_name: string
  username: string
  email: string
  password_hash: string
  avatar_url?: string | null
  bio?: string | null
  rating?: number
  created_at?: string
}

export interface Address {
  id: number
  user_id?: number
  full_name?: string
  phone_number?: string
  street_address?: string
  city?: string
  postal_code?: string
  created_at?: string
}

export interface Admin {
  id: number
  user_id?: number
  role?: string // 'moderator' | 'admin' | ...
  created_at?: string
}

export interface Category {
  id: number
  name: string
}

export interface Tag {
  id: number
  name?: string
}

export interface Item {
  id: number
  user_id?: number
  category_id?: number
  title: string
  description?: string
  price: number
  condition?: string
  brand?: string
  size?: string
  status?: 'available' | 'sold' | 'pending' | string
  create_at?: string
}

export interface Image {
  id: number
  item_id?: number
  image_url: string
}

export interface ItemTag {
  item_id: number
  tag_id: number
}

export interface Favorite {
  user_id: number
  item_id: number
}

// Database Message type
export interface DbMessage {
  id: number
  sender_id?: number
  receiver_id?: number
  item_id?: number
  content: string
  created_at?: string
}

export interface Notification {
  id: number
  user_id?: number
  type?: string
  content?: string
  is_read?: boolean
  created_at?: string
}

export interface Order {
  id: number
  buyer_id?: number
  seller_id?: number
  item_id?: number
  total_price?: number
  status?: 'pending' | 'completed' | 'cancelled' | string
  create_at?: string
}

export interface Payment {
  id: number
  order_id?: number
  payment_method?: string
  payment_status?: 'pending' | 'completed' | 'failed' | string
  transaction_id?: string
  created_at?: string
}

export interface Review {
  id: number
  reviewer_id?: number
  reviewed_id?: number
  order_id?: number
  rating: number // 1–5
  comment?: string
  created_at?: string
}

export interface Wallet {
  user_id: number
  balance?: number
  updated_at?: string
}

// Frontend-specific types for the React application

// Frontend User type
export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  bio?: string
  rating?: number
  totalSales?: number
}

// Frontend Message type
export interface Message {
  id: string
  senderId: string
  receiverId: string
  productId: string
  content: string
  timestamp: Date
  read: boolean
}

// Frontend Product type
export interface Product {
  id: string
  title: string
  description: string
  price: number
  images: string[]
  category: string
  size?: string
  brand?: string
  condition: string
  sellerId: string
  seller: User
  favoriteCount: number
  isFavorited: boolean
}

// Frontend Conversation type
export interface Conversation {
  id: string
  otherUser: User
  lastMessage: Message
  product: Product
  unreadCount: number
}

// Frontend Purchase type
export interface Purchase {
  id: string
  productId: string
  product: Product
  buyerId: string
  sellerId: string
  purchaseDate: Date
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled'
}