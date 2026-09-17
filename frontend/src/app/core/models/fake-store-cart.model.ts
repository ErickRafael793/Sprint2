export interface FakeStoreCartProduct {
  productId: number;
  quantity: number;
}


export interface FakeStoreCart {
  id: number;

  userId: number;

  date: string;

  products: FakeStoreCartProduct[];
}