import { mount } from '../../src';
import { mount as riotMount } from 'riot';

describe('mount', () => {
  it('is identical with one of "riot"', () => {
    expect(mount).toBe(riotMount);
  });
});
