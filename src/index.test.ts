import {assert} from '@augment-vir/assert';
import {describe, it} from '@augment-vir/test';

describe('index', () => {
    it('exports', async () => {
        const {extractRelevantArgs} = await import('./index.js');
        assert.isDefined(extractRelevantArgs);
    });
});
