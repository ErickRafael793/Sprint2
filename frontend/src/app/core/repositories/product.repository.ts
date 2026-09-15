import {
  Product
} from '../models/product.model';

import {
  CreateProductInput
} from '../models/create-product-input.model';

import {
  UpdateProductInput
} from '../models/update-product-input.model';


export abstract class ProductRepository {

  // US03 / US04
  abstract getProducts():
    Promise<Product[]>;


        // US04
    abstract getCategories():
        Promise<string[]>;

    // US04
    abstract getProductsByCategory(
        category: string
    ): Promise<Product[]>;

  // US05
  abstract getProductById(
    id: number
  ): Promise<Product | null>;


  // US06
  abstract createProduct(
    input: CreateProductInput
  ): Promise<Product>;


  // US07
  abstract updateProduct(
    id: number,
    input: UpdateProductInput
  ): Promise<Product | null>;


  // US08
  abstract deleteProduct(
    id: number
  ): Promise<boolean>;

}