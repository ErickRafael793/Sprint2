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
  CartItem
} from '../../../core/models/cart-item.model';

import {
  UserSession
} from '../../../core/models/user-session.model';

import {
  CartRepository
} from '../../../core/repositories/cart.repository';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';


export type CartStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error';


@Injectable()
export class CartViewModel {

  private readonly cartRepository =
    inject(CartRepository);

  private readonly sessionRepository =
    inject(SessionRepository);

  private readonly router =
    inject(Router);


  readonly items =
    signal<CartItem[]>([]);


  readonly session =
    signal<UserSession | null>(null);


  readonly status =
    signal<CartStatus>('idle');


  readonly updatingProductId =
    signal<number | null>(null);


  readonly selectedForRemoval =
    signal<CartItem | null>(null);


  readonly showRemoveConfirmation =
    signal(false);


  readonly removing =
    signal(false);


  readonly operationError =
    signal(false);


  readonly isLoading = computed(
    () =>
      this.status() === 'loading'
  );


  readonly canAccess = computed(
    () =>
      this.session()?.role === 'CLIENTE'
  );


  readonly isEmpty = computed(
    () =>
      this.status() === 'ready' &&
      this.items().length === 0
  );


  readonly subtotal = computed(() => {

    return this.items()
      .reduce(
        (total, item) =>
          total +
          (
            item.product.price *
            item.quantity
          ),
        0
      );

  });


  readonly totalUnits = computed(() => {

    return this.items()
      .reduce(
        (total, item) =>
          total +
          item.quantity,
        0
      );

  });


  async initialize(): Promise<void> {

    this.status.set(
      'loading'
    );


    try {

      const [
        items,
        session
      ] = await Promise.all([

        this.cartRepository
          .getItems(),

        this.sessionRepository
          .getCurrentSession()

      ]);


      this.items.set(
        items
      );


      this.session.set(
        session
      );


      this.status.set(
        'ready'
      );

    } catch {

      this.status.set(
        'error'
      );

    }

  }


  async increase(
    item: CartItem
  ): Promise<void> {

    await this.changeQuantity(
      item,
      item.quantity + 1
    );

  }


  async decrease(
    item: CartItem
  ): Promise<void> {

    if (item.quantity <= 1) {

      return;

    }


    await this.changeQuantity(
      item,
      item.quantity - 1
    );

  }


  requestRemove(
    item: CartItem
  ): void {

    this.operationError.set(
      false
    );


    this.selectedForRemoval.set(
      item
    );


    this.showRemoveConfirmation.set(
      true
    );

  }


  cancelRemove(): void {

    if (this.removing()) {

      return;

    }


    this.showRemoveConfirmation.set(
      false
    );


    this.selectedForRemoval.set(
      null
    );


    this.operationError.set(
      false
    );

  }


  async confirmRemove():
    Promise<void> {

    const item =
      this.selectedForRemoval();


    if (
      !item ||
      this.removing()
    ) {

      return;

    }


    this.removing.set(
      true
    );


    this.operationError.set(
      false
    );


    try {

      const removed =
        await this.cartRepository
          .removeItem(
            item.product.id
          );


      if (!removed) {

        this.operationError.set(
          true
        );

        return;

      }


      this.items.update(
        items =>
          items.filter(
            current =>
              current.product.id !==
              item.product.id
          )
      );


      this.showRemoveConfirmation.set(
        false
      );


      this.selectedForRemoval.set(
        null
      );


    } catch {

      this.operationError.set(
        true
      );


    } finally {

      this.removing.set(
        false
      );

    }

  }


  goToCatalog(): void {

    this.router.navigate([
      '/catalog'
    ]);

  }


  async retry(): Promise<void> {

    await this.initialize();

  }


  private async changeQuantity(
    item: CartItem,
    quantity: number
  ): Promise<void> {

    if (
      this.updatingProductId() !== null
    ) {

      return;

    }


    this.updatingProductId.set(
      item.product.id
    );


    this.operationError.set(
      false
    );


    try {

      const updated =
        await this.cartRepository
          .updateQuantity(
            item.product.id,
            quantity
          );


      if (!updated) {

        this.operationError.set(
          true
        );

        return;

      }


      this.items.update(
        items =>
          items.map(
            current => {

              if (
                current.product.id ===
                updated.product.id
              ) {

                return updated;

              }


              return current;

            }
          )
      );


    } catch {

      this.operationError.set(
        true
      );


    } finally {

      this.updatingProductId.set(
        null
      );

    }

  }

}