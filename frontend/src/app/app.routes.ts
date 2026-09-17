import {
  Routes
} from '@angular/router';

import {
  Login
} from './features/auth/view/login/login';

import {
  Profile
} from './features/auth/view/profile/profile';

import {
  Catalog
} from './features/catalog/view/catalog/catalog';

import {
  ProductDetail
} from './features/catalog/view/product-detail/product-detail';

import {
  ProductCreate
} from './features/inventory/view/product-create/product-create';

import {
  ProductEdit
} from './features/inventory/view/product-edit/product-edit';

import {
  InventoryList
} from './features/inventory/view/inventory-list/inventory-list';

import {
  Cart
} from './features/cart/view/cart/cart';

import {
  Users
} from './features/audit/view/users/users';

import {
  AuditCarts
} from './features/audit/view/audit-carts/audit-carts';

import {
  authGuard
} from './core/guards/auth.guard';

import {
  roleGuard
} from './core/guards/role.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },


  /*
   * Pública
   */
  {
    path: 'login',
    component: Login
  },


  /*
   * Protegidas por sesión
   */
  {
    path: 'profile',
    component: Profile,
    canActivate: [authGuard]
  },


  {
    path: 'catalog',
    component: Catalog,
    canActivate: [authGuard]
  },


  {
    path: 'products/:id',
    component: ProductDetail,
    canActivate: [authGuard]
  },


  {
    path: 'admin/products/new',
    component: ProductCreate,
    canActivate: [authGuard]
  },

  {
  path: 'inventory',
  component: InventoryList,
  canActivate: [authGuard]
  },
  {
    path: 'admin/products/:id/edit',
    component: ProductEdit,
    canActivate: [authGuard]
  },


  {
    path: 'cart',
    component: Cart,
    canActivate: [authGuard]
  },


  {
  path: 'audit/users',

  component: Users,

  canActivate: [
    authGuard,
    roleGuard
  ],

  data: {
    allowedRoles: [
      'ADMIN',
      'AUDITOR'
    ]
  }
},


  {
  path: 'audit/carts',

  component: AuditCarts,

  canActivate: [
    authGuard,
    roleGuard
  ],

  data: {
    allowedRoles: [
      'ADMIN',
      'AUDITOR'
    ]
  }
},


  /*
   * Cualquier ruta desconocida
   */
  {
    path: '**',
    redirectTo: 'login'
  }

];