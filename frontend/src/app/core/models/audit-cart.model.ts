export interface AuditCartItem {

  productId: number;

  title: string;

  quantity: number;

}


export interface AuditCart {

  id: number;

  userId: number;

  date: string;

  items: AuditCartItem[];

}