import {
    Injectable,
    inject
} from '@angular/core';

import {
    HttpClient,
    HttpErrorResponse
} from '@angular/common/http';

import {
    firstValueFrom
} from 'rxjs';

import {
    Product
} from '../models/product.model';

import {
    ProductRepository
} from './product.repository';

import {
    CreateProductInput
} from '../models/create-product-input.model';

import {
    UpdateProductInput
} from '../models/update-product-input.model';


@Injectable()
export class FakeStoreProductRepository
    extends ProductRepository {

    private readonly http =
        inject(HttpClient);

    private readonly baseUrl =
        'https://fakestoreapi.com';


    async getProducts(): Promise<Product[]> {

        try {

            return await firstValueFrom(
                this.http.get<Product[]>(
                    `${this.baseUrl}/products`
                )
            );

        } catch (error) {

            throw this.normalizeError(error);

        }

    }


    async getCategories(): Promise<string[]> {

        try {

            return await firstValueFrom(
                this.http.get<string[]>(
                    `${this.baseUrl}/products/categories`
                )
            );

        } catch (error) {

            throw this.normalizeError(error);

        }

    }


    async getProductsByCategory(
        category: string
    ): Promise<Product[]> {

        try {

            return await firstValueFrom(
                this.http.get<Product[]>(
                    `${this.baseUrl}/products/category/${category}`
                )
            );

        } catch (error) {

            throw this.normalizeError(error);

        }

    }


    async getProductById(
        id: number
    ): Promise<Product | null> {

        try {

            const product =
                await firstValueFrom(
                    this.http.get<Product>(
                        `${this.baseUrl}/products/${id}`
                    )
                );

            return product ?? null;

        } catch (error) {

            if (
                error instanceof HttpErrorResponse &&
                error.status === 404
            ) {

                return null;

            }

            throw this.normalizeError(error);

        }

    }


    async createProduct(
        input: CreateProductInput
    ): Promise<Product> {

        try {

            return await firstValueFrom(
                this.http.post<Product>(
                    `${this.baseUrl}/products`,
                    input
                )
            );

        } catch (error) {

            throw this.normalizeError(error);

        }

    }


    async updateProduct(
        id: number,
        input: UpdateProductInput
    ): Promise<Product | null> {

        try {

            return await firstValueFrom(
                this.http.put<Product>(
                    `${this.baseUrl}/products/${id}`,
                    input
                )
            );

        } catch (error) {

            if (
                error instanceof HttpErrorResponse &&
                error.status === 404
            ) {

                return null;

            }

            throw this.normalizeError(error);

        }

    }


    async deleteProduct(
        id: number
    ): Promise<boolean> {

        try {

            await firstValueFrom(
                this.http.delete(
                    `${this.baseUrl}/products/${id}`
                )
            );

            return true;

        } catch (error) {

            if (
                error instanceof HttpErrorResponse &&
                error.status === 404
            ) {

                return false;

            }

            throw this.normalizeError(error);

        }

    }


    private normalizeError(
        error: unknown
    ): Error {

        if (
            error instanceof HttpErrorResponse &&
            error.status === 0
        ) {

            return new Error('NETWORK_ERROR');

        }

        return new Error('SERVER_ERROR');

    }

}