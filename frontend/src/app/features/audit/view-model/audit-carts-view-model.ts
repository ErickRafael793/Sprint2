import {
  computed,
  inject,
  Injectable,
  signal
} from '@angular/core';

import {
  UserSession
} from '../../../core/models/user-session.model';

import {
  Router
} from '@angular/router';

import {
  AuditCart
} from '../../../core/models/audit-cart.model';

import {
  AuditCartRepository
} from '../../../core/repositories/audit-cart.repository';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';


export type AuditCartsStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'error';


@Injectable()
export class AuditCartsViewModel {

  private readonly auditCartRepository =
    inject(AuditCartRepository);

  private readonly sessionRepository =
    inject(SessionRepository);

  private readonly router =
    inject(Router);


  readonly carts =
    signal<AuditCart[]>([]);

  readonly session =
    signal<UserSession | null>(
    null
  );

  readonly status =
    signal<AuditCartsStatus>('idle');


  readonly expandedCartId =
    signal<number | null>(null);


  readonly isLoading = computed(
    () =>
      this.status() === 'loading'
  );


  readonly hasError = computed(
    () =>
      this.status() === 'error'
  );


  async initialize(): Promise<void> {

    this.status.set(
      'loading'
    );


    try {

      const session =
        await this.sessionRepository
          .getCurrentSession();

      this.session.set(session);

      /*
       * US12:
       * La auditoría es solamente
       * para AUDITOR.
       */
      if (
       session?.role !== 'ADMIN' &&
      session?.role !== 'AUDITOR'
      )  {

        await this.router.navigate(
          ['/catalog'],
          {
            queryParams: {
              auditDenied: 'true'
            }
          }
        );

        return;

      }


      const carts =
        await this.auditCartRepository
          .getGlobalCarts();


      this.carts.set(
        carts
      );


      this.status.set(
        'ready'
      );

    } catch {

      this.carts.set(
        []
      );


      this.status.set(
        'error'
      );

    }

  }


  toggleCart(
    cartId: number
  ): void {

    if (
      this.expandedCartId() ===
      cartId
    ) {

      this.expandedCartId.set(
        null
      );

      return;

    }


    this.expandedCartId.set(
      cartId
    );

  }


  isExpanded(
    cartId: number
  ): boolean {

    return (
      this.expandedCartId() ===
      cartId
    );

  }


  async retry(): Promise<void> {

    await this.initialize();

  }


  goToCatalog(): void {

    this.router.navigate([
      '/catalog'
    ]);

  }

}