export interface WebhookData {
    event: string // 'charge.completed',
    data: {
        id: number // 5029538,
        tx_ref: string // '7mXzxtwo0R3g1Y',
        flw_ref: string //'FLW-MOCK-86e938f440b355bb21755432ebd07c76',
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