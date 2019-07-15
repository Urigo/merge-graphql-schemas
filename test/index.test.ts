import { fileLoader, mergeTypes, mergeResolvers } from '../src/index';

describe('index', () => {
  it('exposes mergeTypes', () => {
    expect(mergeTypes).toBeDefined();
  });

  it('exposes mergeResolvers', () => {
    expect(mergeResolvers).toBeDefined();
  });

  it('exposes fileLoader', () => {
    expect(fileLoader).toBeDefined();
  });
});
