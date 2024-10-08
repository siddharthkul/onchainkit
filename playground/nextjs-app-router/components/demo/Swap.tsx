import { ENVIRONMENT, ENVIRONMENT_VARIABLES } from '@/lib/constants';
import {
  type LifeCycleStatus,
  Swap,
  SwapAmountInput,
  SwapButton,
  SwapMessage,
  SwapToggleButton,
} from '@coinbase/onchainkit/swap';
import type { Token } from '@coinbase/onchainkit/token';
import { useCallback, useContext } from 'react';
import { useAccount } from 'wagmi';
import { AppContext } from '../AppProvider';

function SwapComponent() {
  const { address } = useAccount();
  const { chainId } = useContext(AppContext);

  const degenToken: Token = {
    name: 'DEGEN',
    address: '0x4ed4e862860bed51a9570b96d89af5e1b0efefed',
    symbol: 'DEGEN',
    decimals: 18,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/3b/bf/3bbf118b5e6dc2f9e7fc607a6e7526647b4ba8f0bea87125f971446d57b296d2-MDNmNjY0MmEtNGFiZi00N2I0LWIwMTItMDUyMzg2ZDZhMWNm',
    chainId: 8453,
  };

  const ethToken: Token = {
    name: 'ETH',
    address: '',
    symbol: 'ETH',
    decimals: 18,
    image:
      'https://wallet-api-production.s3.amazonaws.com/uploads/tokens/eth_288.png',
    chainId: 8453,
  };

  const usdcToken: Token = {
    name: 'USDC',
    address: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913',
    symbol: 'USDC',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/44/2b/442b80bd16af0c0d9b22e03a16753823fe826e5bfd457292b55fa0ba8c1ba213-ZWUzYjJmZGUtMDYxNy00NDcyLTg0NjQtMWI4OGEwYjBiODE2',
    chainId: 8453,
  };

  const wethToken: Token = {
    name: 'Wrapped Ether',
    address: '0x4200000000000000000000000000000000000006',
    symbol: 'WETH',
    decimals: 6,
    image:
      'https://d3r81g40ycuhqg.cloudfront.net/wallet/wais/47/bc/47bc3593c2dec7c846b66b7ba5f6fa6bd69ec34f8ebb931f2a43072e5aaac7a8-YmUwNmRjZDUtMjczYy00NDFiLWJhZDUtMzgwNjFmYWM0Njkx',
    chainId: 8453,
  };

  const swappableTokens = [degenToken, ethToken, usdcToken, wethToken];

  const handleOnStatus = useCallback((lifeCycleStatus: LifeCycleStatus) => {
    console.log('Status:', lifeCycleStatus);
  }, []);

  return (
    <div className="relative h-full w-full">
      {address ? (
        chainId !== 8453 ? (
          <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center rounded-xl bg-[#000000] bg-opacity-50 text-center">
            <div className="mx-auto w-2/3 rounded-md bg-muted p-6 text-sm">
              Swap Demo is only available on Base.
              <br />
              Please change your chain in settings.
            </div>
          </div>
        ) : (
          <></>
        )
      ) : (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center rounded-xl bg-[#000000] bg-opacity-50 text-center">
          <div className="mx-auto w-2/3 rounded-md bg-muted p-6 text-sm">
            Swap Demo requires wallet.
            <br />
            Please connect in settings.
          </div>
        </div>
      )}
      {address ? (
        <Swap className="border bg-[#ffffff]" onStatus={handleOnStatus}>
          <SwapAmountInput
            label="Sell"
            swappableTokens={swappableTokens}
            token={ethToken}
            type="from"
          />
          <SwapToggleButton />
          <SwapAmountInput
            label="Buy"
            swappableTokens={swappableTokens}
            token={usdcToken}
            type="to"
          />
          <SwapButton
            disabled={
              ENVIRONMENT_VARIABLES[ENVIRONMENT.ENVIRONMENT] === 'production'
            }
          />
          <SwapMessage />
        </Swap>
      ) : (
        <></>
      )}
    </div>
  );
}

export default function SwapDemo() {
  return (
    <div className="mx-auto">
      <SwapComponent />
    </div>
  );
}
