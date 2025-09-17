<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Default Payment Gateway
    |--------------------------------------------------------------------------
    |
    | This option controls the default payment gateway that will be used
    | by the payment services. You may set this to any of the gateways
    | you have configured below.
    |
    */
    'default' => env('PAYMENT_GATEWAY', 'stripe'),

    /*
    |--------------------------------------------------------------------------
    | MoMo Payment Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for MoMo payment gateway integration
    |
    */
    'momo' => [
        'partner_code' => env('MOMO_PARTNER_CODE', ''),
        'access_key' => env('MOMO_ACCESS_KEY', ''),
        'secret_key' => env('MOMO_SECRET_KEY', ''),
        'endpoint' => env('MOMO_ENDPOINT', 'https://test-payment.momo.vn/v2/gateway/api/create'),
        'redirect_url' => env('MOMO_REDIRECT_URL', env('APP_URL') . '/payment/momo/callback'),
        'ipn_url' => env('MOMO_IPN_URL', env('APP_URL') . '/api/payment/momo/webhook'),
        'environment' => env('MOMO_ENVIRONMENT', 'sandbox'), // sandbox or production
    ],

    /*
    |--------------------------------------------------------------------------
    | Stripe Payment Configuration
    |--------------------------------------------------------------------------
    |
    | Configuration for Stripe payment gateway integration (for Visa/Mastercard)
    |
    */
    'stripe' => [
        'public_key' => env('STRIPE_PUBLIC_KEY', ''),
        'secret_key' => env('STRIPE_SECRET_KEY', ''),
        'webhook_secret' => env('STRIPE_WEBHOOK_SECRET', ''),
        'currency' => env('STRIPE_CURRENCY', 'vnd'),
        'environment' => env('STRIPE_ENVIRONMENT', 'test'), // test or live
    ],

    /*
    |--------------------------------------------------------------------------
    | PayPal Configuration (Optional - for future expansion)
    |--------------------------------------------------------------------------
    */
    'paypal' => [
        'client_id' => env('PAYPAL_CLIENT_ID', ''),
        'client_secret' => env('PAYPAL_CLIENT_SECRET', ''),
        'environment' => env('PAYPAL_ENVIRONMENT', 'sandbox'), // sandbox or live
    ],

    /*
    |--------------------------------------------------------------------------
    | Payment Settings
    |--------------------------------------------------------------------------
    */
    'settings' => [
        // Supported currencies
        'currencies' => ['VND', 'USD'],
        
        // Default currency
        'default_currency' => 'VND',
        
        // Payment timeout (in minutes)
        'payment_timeout' => 30,
        
        // Auto-cancel unpaid bookings after (in hours)
        'auto_cancel_timeout' => 24,
        
        // Supported payment methods
        'supported_methods' => [
            'momo' => [
                'name' => 'Ví MoMo',
                'description' => 'Thanh toán qua ví điện tử MoMo',
                'icon' => 'momo.svg',
                'enabled' => true,
            ],
            'visa' => [
                'name' => 'Thẻ Visa',
                'description' => 'Thanh toán qua thẻ Visa',
                'icon' => 'visa.svg', 
                'enabled' => true,
            ],
            'mastercard' => [
                'name' => 'Thẻ Mastercard',
                'description' => 'Thanh toán qua thẻ Mastercard',
                'icon' => 'mastercard.svg',
                'enabled' => true,
            ],
            'bank_transfer' => [
                'name' => 'Chuyển khoản ngân hàng',
                'description' => 'Chuyển khoản trực tiếp qua ngân hàng',
                'icon' => 'bank.svg',
                'enabled' => false, // Disabled by default
            ],
        ],
    ],
];