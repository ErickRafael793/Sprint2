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
  ProductRepository
} from '../../../core/repositories/product.repository';

import {
  SessionRepository
} from '../../../core/repositories/session.repository';

import {
  UserSession
} from '../../../core/models/user-session.model';


export type ProductCreateStatus =
  | 'idle'
  | 'saving'
  | 'success'
  | 'error';


@Injectable()
export class ProductCreateViewModel {

  private readonly productRepository =
    inject(ProductRepository);

  private readonly sessionRepository =
    inject(SessionRepository);

  private readonly router =
    inject(Router);


  /*
   * Sesión / rol
   */
  readonly session =
    signal<UserSession | null>(null);

  readonly sessionLoading =
    signal(true);


  readonly canManage = computed(
    () =>
      this.session()?.role === 'ADMIN'
  );


  /*
   * Campos
   */
  readonly title =
    signal('');

  readonly price =
    signal('');

  readonly category =
    signal('');

  readonly image =
    signal('');

  readonly description =
    signal('');


  /*
   * Estado
   */
  readonly status =
    signal<ProductCreateStatus>('idle');

  readonly submitted =
    signal(false);

  readonly showSuccessModal =
    signal(false);

  readonly createdProductId =
    signal<number | null>(null);


  readonly isSaving = computed(
    () =>
      this.status() === 'saving'
  );


  readonly hasError = computed(
    () =>
      this.status() === 'error'
  );


  /*
   * Validaciones
   */
  readonly titleInvalid = computed(
    () =>
      this.submitted() &&
      this.title().trim().length === 0
  );


  readonly priceInvalid = computed(() => {

    if (!this.submitted()) {
      return false;
    }

    const value =
      Number(this.price());

    return (
      this.price().trim() === '' ||
      Number.isNaN(value) ||
      value <= 0
    );

  });


  readonly categoryInvalid = computed(
    () =>
      this.submitted() &&
      this.category().trim() === ''
  );


  readonly imageInvalid = computed(
    () =>
      this.submitted() &&
      !this.isValidUrl(
        this.image()
      )
  );


  readonly descriptionInvalid = computed(
    () =>
      this.submitted() &&
      this.description().trim().length === 0
  );


  readonly formInvalid = computed(
    () =>
      this.titleInvalid() ||
      this.priceInvalid() ||
      this.categoryInvalid() ||
      this.imageInvalid() ||
      this.descriptionInvalid()
  );


  readonly categories = [
    'Ropa',
    'Joyería',
    'Accesorios',
    'Electrónica'
  ];


  async initialize(): Promise<void> {

    this.sessionLoading.set(true);

    const session =
      await this.sessionRepository
        .getCurrentSession();

    this.session.set(session);

    this.sessionLoading.set(false);

  }


  setTitle(
    value: string
  ): void {

    this.title.set(value);

  }


  setPrice(
    value: string
  ): void {

    this.price.set(value);

  }


  setCategory(
    value: string
  ): void {

    this.category.set(value);

  }


  setImage(
    value: string
  ): void {

    this.image.set(value);

  }


  setDescription(
    value: string
  ): void {

    this.description.set(value);

  }


  async createProduct(): Promise<void> {

    if (!this.canManage()) {
      return;
    }


    this.submitted.set(true);


    if (this.formInvalid()) {
      return;
    }


    this.status.set('saving');


    try {

      const product =
        await this.productRepository
          .createProduct({

            title:
              this.title().trim(),

            price:
              Number(this.price()),

            category:
              this.category(),

            image:
              this.image().trim(),

            description:
              this.description().trim()

          });


      this.createdProductId.set(
        product.id
      );

      this.status.set('success');

      this.showSuccessModal.set(true);

    } catch {

      this.status.set('error');

    }

  }


  acceptSuccess(): void {

    this.showSuccessModal.set(false);

    this.resetForm();

  }


  goToCatalog(): void {

    this.router.navigate([
      '/catalog'
    ]);

  }


  private resetForm(): void {

    this.title.set('');

    this.price.set('');

    this.category.set('');

    this.image.set('');

    this.description.set('');

    this.submitted.set(false);

    this.createdProductId.set(null);

    this.status.set('idle');

  }


  private isValidUrl(
    value: string
  ): boolean {

    if (!value.trim()) {
      return false;
    }


    try {

      const url =
        new URL(value);

      return (
        url.protocol === 'http:' ||
        url.protocol === 'https:'
      );

    } catch {

      return false;

    }

  }

}