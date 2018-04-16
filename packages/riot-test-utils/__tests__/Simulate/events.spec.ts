import { Simulate } from '../../src';
import each from 'lodash/each';
import keys from 'lodash/keys';

interface EventTestSuite {
  [type: string]: {
    options?: {},
    shouldContain?: { [key: string]: any },
  };
}

/** create default test suites for all event types */
const defaultEvents: EventTestSuite = {
};
each(Simulate.eventTypes, type => defaultEvents[type] = {});

describe('shallow', () => {
  describe('events', () => {
    const events: EventTestSuite = {
      ...defaultEvents,
      // override specific events
      click: { options: undefined, shouldContain: {} },
      keydown: {
        options: { key: 'a', keyCode: 97, metaKey: true },
        shouldContain: {
          key: 'a',
          keyCode: 97,
          which: 97,
          metaKey: true,
          ctrlKey: false,
          shiftKey: false,
        },
      },
      keyup: {}
    };

    each(events, ({ options, shouldContain = {}}, type) => {
      describe(type, () => {
        let element: HTMLInputElement;
        beforeEach(() => {
          element = document.createElement('input');
          document.body.appendChild(element);
        });

        afterEach(() => {
          document.body.removeChild(element);
          element = null;
        });

        it(`fires "${type}" event`, () => {
          const fn = jest.fn();
          element.addEventListener(type, fn);
          try {
            Simulate[type](element, options);

            expect(fn).toHaveBeenCalled();
            const event = fn.mock.calls[0][0];
            expect(event.type).toBe(type);
            expect(extract(event, shouldContain)).toEqual(shouldContain);
          } finally {
            element.removeEventListener(type, fn);
          }
        });
      });
    });
  });
});

function extract(obj: Object, keyObj: Object) {
  const result = {};
  each(keys(keyObj), key => {
    result[key] = obj[key];
  });
  return result;
}
