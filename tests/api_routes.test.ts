import { test, describe } from 'node:test';
import assert from 'node:assert';

const BASE_URL = 'http://127.0.0.1:3000';

describe('AdCraft AI Server Endpoints & Safeguards', () => {
  test('POST /api/verify-dialect returns valid audit analysis for Kuwaiti copy', async () => {
    const res = await fetch(`${BASE_URL}/api/verify-dialect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: 'كهربتك معاك وين ما تروح، شناطر؟ اطلب الحين بعزبتك',
      }),
    });

    assert.strictEqual(res.status, 200, 'Should return HTTP 200');
    const data = await res.json();
    assert.ok(typeof data.score === 'number', 'Score should be numeric');
    assert.ok(data.score >= 80, 'Kuwaiti dialect text should score high');
    assert.strictEqual(data.status, 'APPROVED', 'Status should be APPROVED');
    assert.ok(data.dialectQuality, 'Should have dialect quality message');
  });

  test('POST /api/verify-dialect rejects empty text with 400', async () => {
    const res = await fetch(`${BASE_URL}/api/verify-dialect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: '   ' }),
    });

    assert.strictEqual(res.status, 400, 'Empty text should return HTTP 400');
    const data = await res.json();
    assert.ok(data.error, 'Should contain error property');
  });

  test('POST /api/generate-copy returns 3 campaign options with Kuwaiti CTA', async () => {
    const res = await fetch(`${BASE_URL}/api/generate-copy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productName: 'BLUETTI AC200MAX',
        productCategory: 'محطات طاقة',
        keyFeatures: 'شحن سريع، متانة عالية',
        concept: 'Lifestyle Kashta',
      }),
    });

    assert.strictEqual(res.status, 200, 'Should return HTTP 200');
    const data = await res.json();
    assert.ok(Array.isArray(data.options), 'Options should be an array');
    assert.ok(data.options.length >= 1, 'Should provide at least 1 ad copy option');
    assert.ok(data.options[0].headline, 'Ad copy must include headline');
    assert.ok(data.options[0].cta, 'Ad copy must include CTA');
  });

  test('POST /api/generate-product-ad validates title requirement', async () => {
    const res = await fetch(`${BASE_URL}/api/generate-product-ad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productOrModel: '',
        description: 'بطارية ممتازة جداً',
        underDescriptionKeywords: 'أداء عالي',
      }),
    });

    assert.strictEqual(res.status, 400, 'Empty product name/model should fail validation');
    const data = await res.json();
    assert.strictEqual(data.field, 'productOrModel');
  });

  test('POST /api/generate-product-ad validates 2-word under-description requirement', async () => {
    const res = await fetch(`${BASE_URL}/api/generate-product-ad`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        productOrModel: 'DJI Mini 4 Pro',
        description: '',
        underDescriptionKeywords: 'كلمة', // only 1 word
      }),
    });

    assert.strictEqual(res.status, 400, 'Under-description under 2 words should fail validation');
    const data = await res.json();
    assert.strictEqual(data.field, 'underDescriptionKeywords');
  });

  test('POST /api/evaluate-voice-tone returns sound tone metrics', async () => {
    const res = await fetch(`${BASE_URL}/api/evaluate-voice-tone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        sampleText: 'شناطر؟ اطلب الحين وتوصيل مجاني لجميع مناطق الكويت',
        durationSec: 5,
        detectedPitch: 'طبيعية ودافئة',
      }),
    });

    assert.strictEqual(res.status, 200, 'Should return HTTP 200');
    const data = await res.json();
    assert.ok(data.overallScore >= 80, 'Score should be high');
    assert.ok(data.verdict, 'Should provide verdict');
  });

  test('POST /api/import-ad-url handles extraction and returns product object', async () => {
    const res = await fetch(`${BASE_URL}/api/import-ad-url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: 'https://instagram.com/p/bluetti-kuwait-camp',
        manualContent: 'محطة طاقة لكشتات البر',
      }),
    });

    assert.strictEqual(res.status, 200, 'Should return HTTP 200');
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.ok(data.product.productName, 'Extracted product must have a name');
    assert.ok(data.product.priceKWD > 0, 'Extracted product must have a price');
  });
});
