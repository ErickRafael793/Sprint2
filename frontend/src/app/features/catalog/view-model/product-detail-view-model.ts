import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  Product
} from '../../../core/models/product.model';

import {
  UserSession
} from '../../../core/models/user-session.model';

import {
  ProductRepository
} from '../../../core/repositories/product.repository';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';

import {
  CartRepository
} from '../../../core/repositories/cart.repository';


export type ProductDetailStatus =
  | 'idle'
  | 'loading'
  | 'success'
  | 'not-found'
  | 'error';


@Injectable()
export class ProductDetailViewModel {

  private readonly productRepository =
    inject(ProductRepository);

  private readonly sessionRepository =
    inject(SessionRepository);

  private readonly cartRepository =
    inject(CartRepository);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  /*
   * PRODUCTO
   */
  readonly product =
    signal<Product | null>(null);


  /*
   * SESIÓN
   */
  readonly session =
    signal<UserSession | null>(null);


  /*
   * ESTADO GENERAL
   */
  readonly status =
    signal<ProductDetailStatus>('idle');


  /*
   * US07
   */
  readonly updateSuccess =
    signal(false);


  /*
   * US08
   */
  readonly showDeleteConfirmation =
    signal(false);

  readonly deleting =
    signal(false);

  readonly deleteError =
    signal(false);


  /*
   * US09
   */
  readonly quantity =
    signal(1);

  readonly addingToCart =
    signal(false);

  readonly cartMessage =
    signal<string | null>(null);

  readonly cartError =
    signal(false);


  readonly isLoading = computed(
    () =>
      this.status() === 'loading'
  );


  readonly isNotFound = computed(
    () =>
      this.status() === 'not-found'
  );


  readonly hasError = computed(
    () =>
      this.status() === 'error'
  );


  readonly role = computed(
    () =>
      this.session()?.role ??
      'CLIENTE'
  );


  /*
   * ADMIN
   */
  readonly canManage = computed(
    () =>
      this.role() === 'ADMIN'
  );


  /*
   * CLIENTE
   */
  readonly canAddToCart = computed(
    () =>
      this.role() === 'CLIENTE'
  );


  /*
   * AUDITOR
   *
   * Con US09 el cliente ya
   * no es solo lectura.
   */
  readonly isReadOnly = computed(
    () =>
      this.role() === 'AUDITOR'
  );


  /*
   * No permitir bajar de 1.
   */
  readonly canDecreaseQuantity =
    computed(
      () =>
        this.quantity() > 1
    );


  async initialize(): Promise<void> {

    this.status.set(
      'loading'
    );


    /*
     * Resultado de US07.
     */
    const updated =
      this.route.snapshot
        .queryParamMap
        .get('updated');


    this.updateSuccess.set(
      updated === 'success'
    );


    const idParam =
      this.route.snapshot
        .paramMap
        .get('id');


    const id =
      Number(idParam);


    if (
      !idParam ||
      Number.isNaN(id)
    ) {

      this.status.set(
        'not-found'
      );

      return;

    }


    try {

      const [
        product,
        session
      ] = await Promise.all([

        this.productRepository
          .getProductById(id),

        this.sessionRepository
          .getCurrentSession()

      ]);


      this.session.set(
        session
      );


      if (!product) {

        this.product.set(
          null
        );

        this.status.set(
          'not-found'
        );

        return;

      }


      this.product.set(
        product
      );


      this.status.set(
        'success'
      );

    } catch {

      this.product.set(
        null
      );

      this.status.set(
        'error'
      );

    }

  }


  /*
   * =========================
   * US09 - CANTIDAD
   * =========================
   */

  increaseQuantity(): void {

    this.quantity.update(
      current =>
        current + 1
    );


    this.clearCartFeedback();

  }


  decreaseQuantity(): void {

    if (
      this.quantity() <= 1
    ) {

      return;

    }


    this.quantity.update(
      current =>
        current - 1
    );


    this.clearCartFeedback();

  }


  async addToCart(): Promise<void> {

    const product =
      this.product();


    if (
      !product ||
      !this.canAddToCart() ||
      this.addingToCart()
    ) {

      return;

    }


    this.addingToCart.set(
      true
    );

    this.cartError.set(
      false
    );

    this.cartMessage.set(
      null
    );


    try {

      const result =
        await this.cartRepository
          .addItem(
            product,
            this.quantity()
          );


      if (result.wasUpdated) {

        this.cartMessage.set(
          `Cantidad actualizada: ${result.item.quantity} unidades`
        );

      } else {

        this.cartMessage.set(
          'Producto añadido al carrito'
        );

      }


      /*
       * Después de agregar
       * volvemos el selector a 1.
       */
      this.quantity.set(
        1
      );


    } catch {

      this.cartError.set(
        true
      );

    } finally {

      this.addingToCart.set(
        false
      );

    }

  }


  /*
   * =========================
   * US07
   * =========================
   */

  editProduct(): void {

    const product =
      this.product();


    if (
      !product ||
      !this.canManage()
    ) {

      return;

    }


    this.router.navigate([
      '/admin/products',
      product.id,
      'edit'
    ]);

  }


  /*
   * =========================
   * US08
   * =========================
   */

  requestDelete(): void {

    if (
      !this.product() ||
      !this.canManage()
    ) {

      return;

    }


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


    this.deleteError.set(
      false
    );

  }


  async confirmDelete():
    Promise<void> {

    const product =
      this.product();


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


      this.showDeleteConfirmation.set(
        false
      );


      await this.router.navigate(
        ['/catalog'],
        {
          queryParams: {
            deleted: 'success'
          }
        }
      );


    } catch {

      this.deleteError.set(
        true
      );


      this.deleting.set(
        false
      );

    }

  }


  goToCatalog(): void {

    this.router.navigate([
      '/catalog'
    ]);

  }


  private clearCartFeedback(): void {

    this.cartMessage.set(
      null
    );


    this.cartError.set(
      false
    );

  }

}