export type PaymentMethod = "cod" | "advance";

export type PaymentProvider = "jazzcash" | "easypaisa";

export type CheckoutShipping = {
  name: string;
  email: string;
  address: string;
  phone?: string;
};

export type CheckoutCartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type CheckoutRequestBody = {
  items: CheckoutCartItem[];
  shipping: CheckoutShipping;
  paymentMethod: PaymentMethod;
  paymentProvider?: PaymentProvider;
  transactionId?: string;
};
