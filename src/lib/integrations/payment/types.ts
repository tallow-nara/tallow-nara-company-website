export type CreatePaymentInput = {
  orderCode: string
  accessToken: string
  grossAmount: number
  expiryHours: number
  customer: { name: string; email: string; phone: string }
  items: { id: string; name: string; price: number; quantity: number }[]
}

export type CreatePaymentResult = { token: string; redirectUrl: string }

export type PaymentState = 'paid' | 'pending' | 'failed'

export type PaymentNotification = {
  eventId: string
  orderCode: string
  grossAmount: number
  state: PaymentState
}

export interface PaymentAdapter {
  name: string
  createPayment(input: CreatePaymentInput): Promise<CreatePaymentResult>
  parseNotification(body: unknown): PaymentNotification | null
}
