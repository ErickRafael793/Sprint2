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


const TODOS = 'Todos';


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
        signal<string>(TODOS);

    readonly isFiltering =
        signal<boolean>(false);

    readonly categories =
        signal<string[]>([TODOS]);

    readonly isLoading =
        computed<boolean>(
            () => this.status() === 'loading'
        );

    readonly hasError =
        computed<boolean>(
            () => this.status() === 'error'
        );

    readonly filteredProducts =
        computed<Product[]>(
            () => this.products()
        );

    readonly hasProducts =
        computed<boolean>(
            () =>
                this.status() === 'success' &&
                this.filteredProducts().length > 0
        );

    readonly hasActiveFilter =
        computed<boolean>(
            () => this.selectedCategory() !== TODOS
        );


    async initialize(): Promise<void> {

        const deleted =
            this.route.snapshot.queryParamMap.get('deleted');

        const auditDenied =
            this.route.snapshot.queryParamMap.get('auditDenied');

        this.deleteSuccess.set(deleted === 'success');
        this.auditDenied.set(auditDenied === 'true');

        const currentSession =
            await this.sessionRepository.getCurrentSession();

        this.session.set(currentSession);

        await this.loadCategories();

        await this.loadProducts();

    }


    private async loadCategories(): Promise<void> {

        try {

            const categories =
                await this.productRepository.getCategories();

            this.categories.set([TODOS, ...categories]);

        } catch {

            this.categories.set([TODOS]);

        }

    }


    async loadProducts(): Promise<void> {

        this.status.set('loading');

        try {

            const products =
                await this.productRepository.getProducts();

            this.products.set(products);
            this.status.set('success');

        } catch {

            this.products.set([]);
            this.status.set('error');

        }

    }


    async selectCategory(
        category: string
    ): Promise<void> {

        if (category === this.selectedCategory()) {

            return;

        }

        this.selectedCategory.set(category);

        if (category === TODOS) {

            this.isFiltering.set(true);

            try {

                const products =
                    await this.productRepository.getProducts();

                this.products.set(products);
                this.status.set('success');

            } catch {

                this.products.set([]);
                this.status.set('error');

            } finally {

                this.isFiltering.set(false);

            }

            return;

        }

        this.isFiltering.set(true);

        try {

            const products =
                await this.productRepository
                    .getProductsByCategory(category);

            this.products.set(products);
            this.status.set('success');

        } catch {

            this.products.set([]);
            this.status.set('error');

        } finally {

            this.isFiltering.set(false);

        }

    }


    async clearFilter(): Promise<void> {

        await this.selectCategory(TODOS);

    }


    async retry(): Promise<void> {

        await this.loadProducts();

    }

}