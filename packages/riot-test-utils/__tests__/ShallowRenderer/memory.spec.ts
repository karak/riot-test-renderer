import { ShallowRenderer } from '../../src';
import { staticTag } from 'riot-test-renderer-shared/tags/singleTags';
import assertMemoryUsage from '../helpers/assertMemoryUsage';

const MB = 1024 * 1024;

describe('vdom', () => {
  describe('memory', () => {
    it('has no memory-leak', () => {
      const renderer = new ShallowRenderer();
      renderer.loadTags(staticTag);

      assertMemoryUsage(32 * MB, () => {
        for (let i = 0; i < 1000; i += 1) {
          assertMemoryUsage(1 * MB, () => {
            const tag = renderer.createInstance('static');
            tag.unmount();
          });
        }
      });
    });
  });
});
