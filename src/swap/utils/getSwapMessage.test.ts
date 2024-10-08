import { describe, expect, vi } from 'vitest';
import {
  LOW_LIQUIDITY_ERROR_CODE,
  TOO_MANY_REQUESTS_ERROR_CODE,
  USER_REJECTED_ERROR_CODE,
} from '../constants';
import { ETH_TOKEN, USDC_TOKEN } from '../mocks';
/**
 * @vitest-environment node
 */
import { SwapMessage, getSwapMessage } from './getSwapMessage';

describe('getSwapMessage', () => {
  const baseParams = {
    error: undefined,
    from: {
      error: undefined,
      balance: '0',
      amount: '0',
      loading: false,
      token: undefined,
      setAmount: vi.fn(),
      setLoading: vi.fn(),
      setToken: vi.fn(),
    },
    to: {
      error: undefined,
      amount: '0',
      loading: false,
      token: undefined,
      setAmount: vi.fn(),
      setLoading: vi.fn(),
      setToken: vi.fn(),
    },
    loading: false,
  };

  it('should return BALANCE_ERROR when from or to has an error', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        error: { code: 'some_code', error: 'some error' },
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.BALANCE_ERROR);

    const params2 = {
      ...baseParams,
      to: {
        ...baseParams.to,
        error: { code: 'some_code', error: 'some error' },
      },
    };
    expect(getSwapMessage(params2)).toBe(SwapMessage.BALANCE_ERROR);
  });

  it('should return INSUFFICIENT_BALANCE when amount exceeds balance', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, balance: '10', amount: '20' },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.INSUFFICIENT_BALANCE);
  });

  it('should return CONFIRM IN WALLET when pending transaction', () => {
    const params = {
      ...baseParams,
      isTransactionPending: true,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.CONFIRM_IN_WALLET);
  });

  it('should return SWAP_IN_PROGRESS when loading is true', () => {
    const params = {
      ...baseParams,
      loading: true,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.SWAP_IN_PROGRESS);
  });

  it('should return FETCHING_QUOTE when to or from loading is true', () => {
    const params = {
      ...baseParams,
      from: { ...baseParams.from, loading: true },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.FETCHING_QUOTE);

    const params2 = {
      ...baseParams,
      to: { ...baseParams.to, loading: true },
    };
    expect(getSwapMessage(params2)).toBe(SwapMessage.FETCHING_QUOTE);
  });

  it('should return INCOMPLETE_FIELD when required fields are missing', () => {
    const params = {
      ...baseParams,
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.INCOMPLETE_FIELD);

    const params2 = {
      ...baseParams,
      from: {
        ...baseParams.from,
        amount: '10',
        balance: '20',
        token: ETH_TOKEN,
      },
    };
    expect(getSwapMessage(params2)).toBe(SwapMessage.INCOMPLETE_FIELD);

    const params3 = {
      ...baseParams,
      to: { ...baseParams.to, amount: '10', token: USDC_TOKEN },
    };
    expect(getSwapMessage(params3)).toBe(SwapMessage.INCOMPLETE_FIELD);
  });

  it('should return TOO_MANY_REQUESTS when error code is TOO_MANY_REQUESTS_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      error: {
        code: TOO_MANY_REQUESTS_ERROR_CODE,
        error: 'Too many requests error',
        message: '',
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.TOO_MANY_REQUESTS);
  });

  it('should return LOW_LIQUIDITY when error code is LOW_LIQUIDITY_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      error: {
        code: LOW_LIQUIDITY_ERROR_CODE,
        error: 'Low liquidity error',
        message: '',
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.LOW_LIQUIDITY);
  });

  it('should return USER_REJECTED when error code is USER_REJECTED_ERROR_CODE', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      error: {
        code: USER_REJECTED_ERROR_CODE,
        error: 'User rejected error',
        message: '',
      },
    };
    expect(getSwapMessage(params)).toBe(SwapMessage.USER_REJECTED);
  });

  it('should return the first error message when general error is present', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
      error: {
        code: 'general_error_code',
        error: 'General error occurred',
        message: '',
      },
    };
    expect(getSwapMessage(params)).toBe('');
  });

  it('should return empty string when no error and all conditions are satisfied', () => {
    const params = {
      ...baseParams,
      from: {
        ...baseParams.from,
        balance: '10',
        amount: '5',
        token: ETH_TOKEN,
      },
      to: { ...baseParams.to, amount: '5', token: USDC_TOKEN },
    };
    expect(getSwapMessage(params)).toBe('');
  });
});
