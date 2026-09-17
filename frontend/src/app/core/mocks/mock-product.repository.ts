import { Injectable } from '@angular/core';

import {
  Product
} from '../models/product.model';

import {
  ProductRepository
} from '../repositories/product.repository';

import {
  CreateProductInput
} from '../models/create-product-input.model';
import {
  UpdateProductInput
} from '../models/update-product-input.model';

@Injectable()
export class MockProductRepository
  extends ProductRepository {

  private nextId = 21;


  private readonly products: Product[] = [

    {
      id: 1,
      title: 'Mochila urbana',
      price: 39.90,
      category: 'Accesorios',
      description:
        'Ligera, resistente y cómoda. Incluye compartimento acolchado y cierres reforzados.',
      image:
        'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600'
    },

    {
      id: 2,
      title: 'Playera suave',
      price: 22.50,
      category: 'Ropa',
      description:
        'Playera cómoda de uso diario.',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
    },

    {
      id: 3,
      title: 'Pulsera dorada',
      price: 18.00,
      category: 'Joyería',
      description:
        'Pulsera de diseño elegante.',
      image:
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600'
    },

    {
      id: 4,
      title: 'Disco externo',
      price: 64.90,
      category: 'Electrónica',
      description:
        'Almacenamiento externo compacto.',
      image:
        'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=600'
    },

    {
      id: 5,
      title: 'Sudadera crema',
      price: 39.90,
      category: 'Ropa',
      description:
        'Sudadera suave para uso diario.',
      image:
        'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600'
    },

    {
      id: 6,
      title: 'Playera clásica',
      price: 22.50,
      category: 'Ropa',
      description:
        'Playera clásica de algodón.',
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600'
    },

    {
      id: 7,
      title: 'Chaqueta ligera',
      price: 18.00,
      category: 'Ropa',
      description:
        'Chaqueta ligera y cómoda.',
      image:
        'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600'
    },

    {
      id: 8,
      title: 'Blusa casual',
      price: 64.90,
      category: 'Ropa',
      description:
        'Blusa casual para cualquier ocasión.',
      image:
        'https://images.unsplash.com/photo-1598554747436-c9293d6a588f?w=600'
    },

    {
      id: 9,
      title: 'Collar minimalista',
      price: 27.90,
      category: 'Joyería',
      description:
        'Collar elegante de diseño minimalista.',
      image:
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600'
    }

  ];


  async getProducts(): Promise<Product[]> {

    await this.simulateDelay(700);

    this.validateConnection();


    return this.products.map(
      product => ({
        ...product
      })
    );

  }


  async getProductById(
    id: number
  ): Promise<Product | null> {

    await this.simulateDelay(500);

    this.validateConnection();


    const product =
      this.products.find(
        item => item.id === id
      );


    return product
      ? { ...product }
      : null;

  }
  
      async getCategories(): Promise<string[]> {

        await this.simulateDelay(300);
        this.validateConnection();

        const categories = new Set(
            this.products.map(p => p.category)
        );

        return Array.from(categories);

    }


    async getProductsByCategory(
        category: string
    ): Promise<Product[]> {

        await this.simulateDelay(500);
        this.validateConnection();

        return this.products
            .filter(p => p.category === category)
            .map(p => ({ ...p }));

    }


  async createProduct(
    input: CreateProductInput
  ): Promise<Product> {

    await this.simulateDelay(700);

    this.validateConnection();


    const newProduct: Product = {

      id: this.nextId,

      title: input.title,

      price: input.price,

      category: input.category,

      image: input.image,

      description: input.description

    };


    this.products.push(
      newProduct
    );


    this.nextId++;


    return {
      ...newProduct
    };

  }
  async updateProduct(
  id: number,
  input: UpdateProductInput
): Promise<Product | null> {

  await this.simulateDelay(800);

  this.validateConnection();


  const index =
    this.products.findIndex(
      product => product.id === id
    );


  if (index === -1) {

    return null;

  }


  const updatedProduct: Product = {

    ...this.products[index],

    title:
      input.title,

    price:
      input.price,

    category:
      input.category,

    image:
      input.image,

    description:
      input.description

  };
  


  this.products[index] =
    updatedProduct;


  return {
    ...updatedProduct
  };

}
async deleteProduct(
  id: number
): Promise<boolean> {

  await this.simulateDelay(700);

  this.validateConnection();


  const index =
    this.products.findIndex(
      product => product.id === id
    );


  if (index === -1) {

    return false;

  }


  this.products.splice(
    index,
    1
  );


  return true;

}


  private async simulateDelay(
    milliseconds: number
  ): Promise<void> {

    await new Promise<void>(
      resolve => {

        setTimeout(
          resolve,
          milliseconds
        );

      }
    );

  }


  private validateConnection(): void {

    if (!navigator.onLine) {

      throw new Error(
        'NETWORK_ERROR'
      );

    }

  }

}