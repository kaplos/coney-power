// src/app/api/webhook/route.test.js

jest.mock('stripe');
jest.mock('fs');
jest.mock('path', () => ({
  join: jest.fn(() => '/mocked/path'),
}));
jest.mock('airtable', () => {
  return jest.fn().mockImplementation(() => ({
    base: () => () => ({
      create: jest.fn().mockResolvedValue({ getId: () => 'rec123' }),
      update: jest.fn().mockResolvedValue([{ getId: () => 'rec456' }]),
      select: jest.fn().mockReturnValue({
        firstPage: jest.fn().mockResolvedValue([{ id: 'rec789' }]),
      }),
    }),
  }));
});

const mockEvent = {
  id: 'evt_test',
  type: 'checkout.session.completed',
  data: {
    object: {
      customer_details: {},
      metadata: { userId: 'user1', product: 'prod1' },
      mode: 'payment',
      subscription: 'sub_123',
      payment_intent: 'pi_123',
    },
  },
};

const mockRequest = (body, signature) => ({
  text: async () => body,
  headers: {
    get: (key) => (key === 'stripe-signature' ? signature : undefined),
  },
});

beforeEach(() => {
  jest.clearAllMocks();
  process.env.STRIPE_SECRET = 'sk_test';
  process.env.STRIPE_WEBHOOK_SECRET = 'whsec_test';
  process.env.AIRTABLE_API_KEY = 'key_test';
  process.env.AIRTABLE_BASE_ID = 'base_test';
  process.env.SKIP_STRIPE_SIGNATURE = '';
});

test('POST: valid Stripe webhook processes event', async () => {
  Stripe.mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(() => mockEvent),
    },
  }));
  fs.existsSync.mockReturnValue(true);
  fs.writeFileSync.mockImplementation(() => {});

  const req = mockRequest('body', 'sig');
  const res = await POST(req);
  const text = await res.text();

  expect(res.status).toBe(200);
  expect(text).toBe('Webhook received');
});

test('POST: invalid Stripe signature returns 400', async () => {
  Stripe.mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn(() => {
        throw new Error('Invalid signature');
      }),
    },
  }));

  const req = mockRequest('body', 'bad_sig');
  const res = await POST(req);
  const text = await res.text();