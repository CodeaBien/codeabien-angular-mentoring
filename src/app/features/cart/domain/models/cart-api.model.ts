// Modelos que vienen directamente de la API
export interface CartApiResponse {
	id: number;
	userId: number;
	date: string;
	products: CartProductApi[];
}

export interface CartProductApi {
	productId: number;
	quantity: number;
}

export interface CreateCartRequest {
	userId: number;
	date: string;
	products: CartProductApi[];
}
