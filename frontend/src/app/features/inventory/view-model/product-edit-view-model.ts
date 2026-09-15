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


export type ProductEditStatus =
  | 'idle'
  | 'loading'
  | 'ready'
  | 'saving'
  | 'not-found'
  | 'error';


@Injectable()
export class ProductEditViewModel {

  private readonly productRepository =
    inject(ProductRepository);

  private readonly sessionRepository =
    inject(SessionRepository);

  private readonly route =
    inject(ActivatedRoute);

  private readonly router =
    inject(Router);


  readonly product =
    signal<Product | null>(null);

  readonly session =
    signal<UserSession | null>(null);


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


  readonly status =
    signal<ProductEditStatus>('idle');

  readonly submitted =
    signal(false);


  readonly categories = [
    'Ropa',
    'Joyería',
    'Accesorios',
    'Electrónica'
  ];


  readonly isLoading = computed(
    () =>
      this.status() === 'loading'
  );


  readonly isSaving = computed(
    () =>
      this.status() === 'saving'
  );


  readonly isNotFound = computed(
    () =>
      this.status() === 'not-found'
  );


  readonly hasError = computed(
    () =>
      this.status() === 'error'
  );


  readonly canManage = computed(
    () =>
      this.session()?.role === 'ADMIN'
  );


  readonly titleInvalid = computed(
    () =>
      this.submitted() &&
      this.title().trim() === ''
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
      this.description().trim() === ''
  );


  readonly formInvalid = computed(
    () =>
      this.titleInvalid() ||
      this.priceInvalid() ||
      this.categoryInvalid() ||
      this.imageInvalid() ||
      this.descriptionInvalid()
  );


  async initialize(): Promise<void> {

    this.status.set('loading');


    const idParam =
      this.route.snapshot.paramMap.get(
        'id'
      );


    const id =
      Number(idParam);


    if (
      !idParam ||
      Number.isNaN(id)
    ) {

      this.status.set('not-found');

      return;
    }


    try {

       const updatedProductJson =
  sessionStorage.getItem('updatedProduct');

let updatedProduct: Product | null = null;

if (updatedProductJson) {
  try {
    const storedProduct =
      JSON.parse(updatedProductJson) as Product;

    if (storedProduct.id === id) {
      updatedProduct = storedProduct;
    }

    sessionStorage.removeItem('updatedProduct');

  } catch {
    sessionStorage.removeItem('updatedProduct');
  }
}
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

        this.status.set(
          'not-found'
        );

        return;
      }


      if (updatedProduct && updatedProduct.id === id) {
      this.product.set(updatedProduct);
        } else {
           this.product.set(product);
        }

      /*
       * Precargar formulario
       */
      this.title.set(
        product.title
      );

      this.price.set(
        product.price.toFixed(2)
      );

      this.category.set(
        product.category
      );

      this.image.set(
        product.image
      );

      this.description.set(
        product.description
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


  setTitle(
    value: string
  ): void {

    this.title.set(
      value
    );

  }


  setPrice(
    value: string
  ): void {

    this.price.set(
      value
    );

  }


  setCategory(
    value: string
  ): void {

    this.category.set(
      value
    );

  }


  setImage(
    value: string
  ): void {

    this.image.set(
      value
    );

  }


  setDescription(
    value: string
  ): void {

    this.description.set(
      value
    );

  }


  async saveChanges(): Promise<void> {

    if (
      !this.canManage() ||
      this.isSaving()
    ) {

      return;

    }


    this.submitted.set(
      true
    );


    if (this.formInvalid()) {

      return;

    }


    const product =
      this.product();


    if (!product) {

      return;

    }


    this.status.set(
      'saving'
    );


    try {

      const updated =
        await this.productRepository
          .updateProduct(
            product.id,
            {

              title:
                this.title().trim(),

              price:
                Number(
                  this.price()
                ),

              category:
                this.category(),

              image:
                this.image().trim(),

              description:
                this.description().trim()

            }
          );


      if (!updated) {

        this.status.set(
          'not-found'
        );

        return;

      }


      /*
       * Regresamos al detalle
       * y avisamos que la edición
       * terminó correctamente.
       */
    const visuallyUpdatedProduct: Product = {
  ...product,
  title: this.title().trim(),
  price: Number(this.price()),
  category: this.category(),
  image: this.image().trim(),
  description: this.description().trim()
};

sessionStorage.setItem(
  'updatedProduct',
  JSON.stringify(visuallyUpdatedProduct)
);

await this.router.navigate(
  [
    '/products',
    updated.id
  ],
  {
    queryParams: {
      updated: 'success'
    }
  }
);
    } catch {

      this.status.set(
        'error'
      );

    }

  }


  goBack(): void {

    const product =
      this.product();


    if (product) {

      this.router.navigate([
        '/products',
        product.id
      ]);

      return;

    }


    this.router.navigate([
      '/catalog'
    ]);

  }


  goToCatalog(): void {

    this.router.navigate([
      '/catalog'
    ]);

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