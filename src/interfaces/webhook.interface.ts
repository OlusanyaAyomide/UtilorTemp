export interface WebhookData {
    event: string // 'charge.completed',
    data: {
        id: number // 5029538,
        txRef: string // '7mXzxtwo0R3g1Y',
        flwRef: string //'FLW-MOCK-86e938f440b355bb21755432ebd07c76',
        device_fingerprint: string // 'N/A',
        amount: number // 9000,
        currency: string // 'NGN',
        charged_amount: number // 9000,
        app_fee: number // 126,
        merchant_fee: number //0,
        processor_response: string // 'successful',
        auth_model: string //'PIN',
        ip: string // '52.209.154.143',
        narration: string // 'CARD Transaction ',
        status: string // 'successful',
        payment_type: string // 'card',
        created_at: string // '2024-04-15T16:54:34.000Z',
        account_id: number // 1956216,
        customer: {
            id: number // 2391429,
            name: string // 'undefined undefined',
            phone_number: string | null //null,
            email: string // 'onotaizee@gmail.com',
            created_at: string // '2024-04-15T16:54:34.000Z'
        },
        card: {
            first_6digits: string // '553188',
            last_4digits: string // '2950',
            issuer:string // 'MASTERCARD  CREDIT',
            country: string // 'NG',
            type: string // 'MASTERCARD',
            expiry: string // '09/32'
        }
    },
    'event.type': string //'CARD_TRANSACTION'
}

export interface WebhookData2 {
  id: number // 5044062,
  txRef: string; // 'sMUCqVubXHxDwN',
  flwRef: string; // '2940313924901713912565365',
  orderRef: string; //'URF_1713912565031_6927035',
  paymentPlan: null,
  paymentPage: null,
  createdAt: string; //'2024-04-23T22:49:32.000Z',
  amount: number; // 1500,
  charged_amount: number; // 1500,
  status: string; // 'successful',
  IP: string; // '52.209.154.143',
  currency: string; // 'NGN',
  appfee: number; // 21,
  merchantfee: number; // 0,
  merchantbearsfee: number; //1,
  customer: {
    id: number; // 2395220,
    phone: string; // '08012345678',
    fullName: string; // 'undefined undefined',
    customertoken: null // null,
    email: string; // 'onotaizee@gmail.com',
    createdAt: string; // '2024-04-21T18:34:35.000Z',
    updatedAt: string; //'2024-04-21T18:34:35.000Z',
    deletedAt: null // null,
    AccountId: number; // 1116557
  },
  entity: {
    account_number: string; // '1234567890',
    first_name: string; // 'DOE',
    last_name: string; // 'JOHN',
    createdAt: string; // '2024-04-23T22:49:32.000Z'
  },
  'event.type': string; // 'BANK_TRANSFER_TRANSACTION'
}