import { test, describe } from 'node:test';
import assert from 'node:assert';
import { KUWAITI_MARKETING_LEXICON } from '../src/data/kuwaitiLexicon';

describe('Kuwaiti Lexicon & Dialect Rules', () => {
  test('Lexicon contains key dialect terms', () => {
    assert.ok(Array.isArray(KUWAITI_MARKETING_LEXICON), 'Lexicon should be an array');
    assert.ok(KUWAITI_MARKETING_LEXICON.length > 0, 'Lexicon should have items');

    const shnatir = KUWAITI_MARKETING_LEXICON.find((item) => item.word.includes('شناطر'));
    assert.ok(shnatir, 'Should include "شناطر؟" CTA keyword');
    assert.strictEqual(shnatir.category, 'cta_purchase');
  });

  test('All terms have word, meaning, phonetic guide, and example usage', () => {
    for (const item of KUWAITI_MARKETING_LEXICON) {
      assert.ok(item.word, 'Term must have a word');
      assert.ok(item.meaning, 'Term must have a meaning');
      assert.ok(item.phoneticGuide, 'Term must have a phonetic guide');
      assert.ok(item.adUsageExample, 'Term must have an ad usage example');
    }
  });

  test('Recognizes outdoor and kashta terms', () => {
    const outdoorTerms = KUWAITI_MARKETING_LEXICON.filter((i) => i.category === 'kashta_outdoor');
    assert.ok(outdoorTerms.length >= 2, 'Should have multiple outdoor/kashta terms');
  });
});
