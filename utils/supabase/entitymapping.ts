import { Address } from "@/Entities/Address";
import { BaseEntity } from "@/Entities/BaseEntity";
import { Cart } from "@/Entities/Cart";
import { Category } from "@/Entities/Category";
import { Customer } from "@/Entities/Customer";
import { Favourite } from "@/Entities/Favourite";
import { Gst } from "@/Entities/Gst";
import { Invoice } from "@/Entities/Invoice";
import { Order } from "@/Entities/Order";
import { OrderItem } from "@/Entities/OrderItem";
import { Payment } from "@/Entities/Payment";
import { Product } from "@/Entities/Product";
import { PromoCode } from "@/Entities/PromoCode";
import { Role } from "@/Entities/Role";
import { Shipment } from "@/Entities/Shipment";
import { Status } from "@/Entities/Status";
import { Variant } from "@/Entities/Variant";

export const EntityMapping = {
  "address": Address,
  "baseentity": BaseEntity,
  "cart": Cart,
  "category": Category,
  "customer": Customer,
  "favourite": Favourite,
  "gst": Gst,
  "invoice": Invoice,
  "order": Order,
  "orderitem": OrderItem,
  "payment": Payment,
  "product": Product,
  "promocode": PromoCode,
  "role": Role,
  "shipment": Shipment,
  "status": Status,
  "variant": Variant
} as const;
