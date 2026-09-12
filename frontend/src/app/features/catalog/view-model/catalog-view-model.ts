import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  Product
} from '../../../core/models/product.model';

import {
  ProductRepository
} from '../../../core/repositories/product.repository';

import {
  UserSession
} from '../../../core/models/user-session.model';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';


export type CatalogStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';


export type ProductCategory =
  | 'Todos'
  | 'Ropa'
  | 'Joyería'
  | 'Accesorios'
  | 'Electrónica';


@Injectable()
export class CatalogViewModel {

  private readonly productRepository:
    ProductRepository =
      inject(ProductRepository);


  private readonly sessionRepository:
    SessionRepository =
      inject(SessionRepository);


  private readonly route:
    ActivatedRoute =
      inject(ActivatedRoute);


  readonly session =
    signal<UserSession | null>(null);


  readonly products =
    signal<Product[]>([]);


  readonly role =
    computed(
      () =>
        this.session()?.role ?? ''
    );


  readonly status =
    signal<CatalogStatus>('idle');


  readonly deleteSuccess =
    signal<boolean>(false);


  readonly auditDenied =
    signal<boolean>(false);


  readonly selectedCategory =
    signal<ProductCategory>('Todos');


  readonly isFiltering =
    signal<boolean>(false);


  readonly categories:
    ProductCategory[] = [

      'Todos',
      'Ropa',
      'Joyería',
      'Accesorios',
      'Electrónica'

    ];


  readonly isLoading =
    computed<boolean>(
      () =>
        this.status() === 'loading'
    );


  readonly hasError =
    computed<boolean>(
      () =>
        this.status() === 'error'
    );


  readonly filteredProducts =
    computed<Product[]>(() => {

      const category =
        this.selectedCategory();

      const products =
        this.products();


      if (
        category === 'Todos'
      ) {

        return products;

      }


      return products.filter(
        product =>
          product.category === category
      );

    });


  readonly hasProducts =
    computed<boolean>(
      () =>
        this.status() === 'success' &&
        this.filteredProducts()
          .length > 0
    );


  readonly hasActiveFilter =
    computed<boolean>(
      () =>
        this.selectedCategory() !== 'Todos'
    );


  async initialize():
    Promise<void> {

    const deleted =
      this.route.snapshot
        .queryParamMap
        .get('deleted');


    const auditDenied =
      this.route.snapshot
        .queryParamMap
        .get('auditDenied');


    this.deleteSuccess.set(
      deleted === 'success'
    );


    this.auditDenied.set(
      auditDenied === 'true'
    );


    /*
     * Cargar sesión actual
     * para conocer el rol.
     */
    const currentSession =
      await this.sessionRepository
        .getCurrentSession();


    this.session.set(
      currentSession
    );


    await this.loadProducts();

  }


  async loadProducts():
    Promise<void> {

    this.status.set(
      'loading'
    );


    try {

      const products:
        Product[] =
          await this.productRepository
            .getProducts();


      this.products.set(
        products
      );


      this.status.set(
        'success'
      );

    } catch {

      this.products.set(
        []
      );


      this.status.set(
        'error'
      );

    }

  }


  async selectCategory(
    category: ProductCategory
  ): Promise<void> {

    if (
      category ===
      this.selectedCategory()
    ) {

      return;

    }


    this.isFiltering.set(
      true
    );


    await new Promise<void>(
      resolve => {

        setTimeout(
          resolve,
          350
        );

      }
    );


    this.selectedCategory.set(
      category
    );


    this.isFiltering.set(
      false
    );

  }


  async clearFilter():
    Promise<void> {

    await this.selectCategory(
      'Todos'
    );

  }


  async retry():
    Promise<void> {

    await this.loadProducts();

  }

}