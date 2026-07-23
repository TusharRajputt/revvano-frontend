import { api } from './api';
import type { Order, OrderItem, Address } from '@/types';
import { COUPONS, SHIPPING_FEE, TAX_RATE, FREE_SHIPPING_THRESHOLD } from '@/constants';
import type { Coupon } from '@/types';

interface RawBackendOrder {
  _id: string;
  orderNumber: string;
  createdAt: string;
  status: Order['status'];
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  items: {
    product?: string;
    name: string;
    image: string;
    price: number;
    quantity: number;
    color: string;
    size: string;
  }[];
  shippingAddress: {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  };
  trackingNumber?: string;
}

const mapOrder = (o: RawBackendOrder): Order => ({
  id: o._id,
  orderNumber: o.orderNumber,
  date: o.createdAt,
  status: o.status,
  subtotal: o.subtotal,
  shipping: o.shipping,
  tax: o.tax,
  discount: o.discount,
  total: o.total,
  items: (o.items || []).map((i): OrderItem => ({
    productId: i.product || '',
    name: i.name,
    price: i.price,
    quantity: i.quantity,
    image: i.image,
    color: i.color,
    size: i.size,
  })),
  address: {
    id: 'shipping',
    label: 'Shipping Address',
    fullName: o.shippingAddress?.fullName || '',
    line1: o.shippingAddress?.line1 || '',
    line2: o.shippingAddress?.line2,
    city: o.shippingAddress?.city || '',
    state: o.shippingAddress?.state || '',
    zip: o.shippingAddress?.zip || '',
    country: o.shippingAddress?.country || '',
    phone: o.shippingAddress?.phone || '',
  },
  trackingNumber: o.trackingNumber,
});

export interface CreateOrderInput {
  items: OrderItem[];
  shippingAddress: Omit<Address, 'id' | 'label' | 'isDefault'> & { email?: string };
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  paymentMethod?: 'card' | 'cod';
}

export const orderService = {
  async getOrders(): Promise<Order[]> {
    const { data } = await api.get('/orders/my');
    return (data.orders || []).map(mapOrder);
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const { data } = await api.get(`/orders/${id}`);
      return data.order ? mapOrder(data.order) : null;
    } catch {
      return null;
    }
  },

  async createOrder(input: CreateOrderInput): Promise<Order> {
    const payload = {
      items: input.items.map((i) => ({
        product: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      })),
      shippingAddress: input.shippingAddress,
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      discount: input.discount,
      total: input.total,
      paymentMethod: input.paymentMethod || 'card',
    };
    const { data } = await api.post('/orders', payload);
    return mapOrder(data.order);
  },

  async createRazorpayOrder(amount: number): Promise<{ orderId: string; amount: number; currency: string; keyId: string }> {
    const { data } = await api.post('/payment/create-order', { amount });
    return data;
  },

  async verifyPaymentAndCreateOrder(input: CreateOrderInput & {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<Order> {
    const payload = {
      razorpay_order_id: input.razorpay_order_id,
      razorpay_payment_id: input.razorpay_payment_id,
      razorpay_signature: input.razorpay_signature,
      items: input.items.map((i) => ({
        product: i.productId,
        name: i.name,
        image: i.image,
        price: i.price,
        quantity: i.quantity,
        color: i.color,
        size: i.size,
      })),
      shippingAddress: input.shippingAddress,
      subtotal: input.subtotal,
      shipping: input.shipping,
      tax: input.tax,
      discount: input.discount,
      total: input.total,
    };
    const { data } = await api.post('/payment/verify', payload);
    return mapOrder(data.order);
  },

  async cancelOrder(id: string): Promise<Order> {
    const { data } = await api.put(`/orders/${id}/cancel`);
    return mapOrder(data.order);
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; coupon?: Coupon } {
    const coupon = COUPONS.find((c) => c.code.toLowerCase() === code.toLowerCase());
    if (!coupon) return { valid: false };
    if (subtotal < coupon.minSubtotal) return { valid: false };
    return { valid: true, coupon };
  },

  calculateDiscount(coupon: Coupon, subtotal: number): number {
    if (coupon.type === 'percentage') return Math.round((subtotal * coupon.value) / 100);
    return coupon.value;
  },

  calculateShipping(subtotal: number): number {
    return subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FEE;
  },

  calculateTax(subtotal: number): number {
    return Math.round(subtotal * TAX_RATE * 100) / 100;
  },
};
