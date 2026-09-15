import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  Product
} from '../../../core/models/product.model';

import {
  ProductRepository
} from '../../../core/repositories/product.repository';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';

import {
  UserSession
} from '../../../core/models/user-session.model';


export type InventoryListStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'error';


@Injectable()
export class InventoryListViewModel {

  private readonly productRepository =
    inject(ProductRepository);

  private readonly sessionRepository =
    inject(SessionRepository);

  private readonly router =
    inject(Router);


  readonly products =
    signal<Product[]>([]);

  readonly session =
    signal<UserSession | null>(null);

  readonly status =
    signal<InventoryListStatus>('idle');

  readonly search =
    signal('');

    readonly selectedProduct =
  signal<Product | null>(null);

readonly showDeleteConfirmation =
  signal(false);

readonly deleting =
  signal(false);

readonly deleteError =
  signal(false);


  readonly isLoading =
    computed(
      () =>
        this.status() === 'loading'
    );


  readonly hasError =
    computed(
      () =>
        this.status() === 'error'
    );


  readonly canManage =
    computed(
      () =>
        this.session()?.role === 'ADMIN'
    );


  readonly filteredProducts =
    computed(() => {

      const value =
        this.search()
          .trim()
          .toLowerCase();

      if (!value) {
        return this.products();
      }

      return this.products().filter(
        product =>
          product.title
            .toLowerCase()
            .includes(value)
      );

    });


  async initialize(): Promise<void> {

    this.status.set(
      'loading'
    );

    try {

      const [
        products,
        session
      ] = await Promise.all([

        this.productRepository
          .getProducts(),

        this.sessionRepository
          .getCurrentSession()

      ]);


      this.products.set(
        products
      );

      this.session.set(
        session
      );


      if (
        session?.role !== 'ADMIN'
      ) {

        await this.router.navigate([
          '/catalog'
        ]);

        return;

      }


      this.status.set(
        'success'
      );

    } catch {

      this.status.set(
        'error'
      );

    }

  }


  setSearch(
    value: string
  ): void {

    this.search.set(
      value
    );

  }


  editProduct(
    id: number
  ): void {

    this.router.navigate([
      '/admin/products',
      id,
      'edit'
    ]);

  }


 requestDelete(
  product: Product
): void {

  if (!this.canManage()) {
    return;
  }

  this.selectedProduct.set(
    product
  );

  this.deleteError.set(
    false
  );

  this.showDeleteConfirmation.set(
    true
  );

}


cancelDelete(): void {

  if (this.deleting()) {
    return;
  }

  this.showDeleteConfirmation.set(
    false
  );

  this.selectedProduct.set(
    null
  );

  this.deleteError.set(
    false
  );

}


async confirmDelete():
  Promise<void> {

  const product =
    this.selectedProduct();

  if (
    !product ||
    !this.canManage() ||
    this.deleting()
  ) {
    return;
  }

  this.deleting.set(
    true
  );

  this.deleteError.set(
    false
  );

  try {

    const deleted =
      await this.productRepository
        .deleteProduct(
          product.id
        );

    if (!deleted) {

      this.deleteError.set(
        true
      );

      this.deleting.set(
        false
      );

      return;

    }

    this.products.update(
      products =>
        products.filter(
          item =>
            item.id !== product.id
        )
    );

    this.showDeleteConfirmation.set(
      false
    );

    this.selectedProduct.set(
      null
    );

  } catch {

    this.deleteError.set(
      true
    );

  } finally {

    this.deleting.set(
      false
    );

  }

}

  goToCreate(): void {

    this.router.navigate([
      '/admin/products/new'
    ]);

  }

}