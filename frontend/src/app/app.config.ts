import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient
} from '@angular/common/http';

import {
  routes
} from './app.routes';


import {
  AuthRepository
} from './core/repositories/auth.repository';

import {
  FakeStoreAuthRepository
} from './core/repositories/fake-store-auth.repository';


import {
  SessionRepository
} from './core/repositories/session.repository';

import {
  LocalSessionRepository
} from './core/repositories/local-session.repository';


import {
  ProductRepository
} from './core/repositories/product.repository';


import {
    FakeStoreProductRepository
} from './core/repositories/fake-store-product.repository';

import {
  MockProductRepository
} from './core/mocks/mock-product.repository';


import {
  CartRepository
} from './core/repositories/cart.repository';

import {
  MockCartRepository
} from './core/mocks/mock-cart.repository';


import {
  UserRepository
} from './core/repositories/user.repository';

import {
  MockUserRepository
} from './core/mocks/mock-user.repository';


import {
  AuditCartRepository
} from './core/repositories/audit-cart.repository';

import {
  MockAuditCartRepository
} from './core/mocks/mock-audit-cart.repository';


export const appConfig: ApplicationConfig = {

  providers: [

    provideBrowserGlobalErrorListeners(),

    provideHttpClient(),

    provideRouter(
      routes
    ),


    {
      provide: AuthRepository,
      useClass: FakeStoreAuthRepository
    },


    {
      provide: SessionRepository,
      useClass: LocalSessionRepository
    },


    {
      provide: ProductRepository,
    useClass: FakeStoreProductRepository    },


    {
      provide: CartRepository,
      useClass: MockCartRepository
    },


    {
      provide: UserRepository,
      useClass: MockUserRepository
    },


    {
      provide: AuditCartRepository,
      useClass: MockAuditCartRepository
    }

  ]

};