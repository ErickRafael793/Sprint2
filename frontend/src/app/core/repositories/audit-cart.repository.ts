import {
  AuditCart
} from '../models/audit-cart.model';


export abstract class AuditCartRepository {

  abstract getGlobalCarts():
    Promise<AuditCart[]>;

}