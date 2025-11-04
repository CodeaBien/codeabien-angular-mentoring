// Modelos de dominio enriquecidos
export interface Cart {
  id: number;
  userId: number;
  date: Date;
  items: CartItem[];
}

export interface CartItem {
  productId: number;
  title: string; // Enriquecido con datos del producto
  price: number; // Enriquecido
  image: string; // Enriquecido
  quantity: number;
  subtotal: number; // Calculado
}

