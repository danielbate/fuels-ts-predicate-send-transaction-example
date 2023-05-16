import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import { Address, CoinStatus, JsonFlatAbi, NativeAssetId, Predicate, Provider, ScriptTransactionRequest, Wallet, WalletUnlocked, bn } from 'fuels';
import { BackendAbi__factory } from './types';
import type { CoinQuantityLike } from 'fuels';
import { ValidationInput } from "./types/factories/BackendAbi__factory";

function App() {
  // setup beta 3 provider
  const provider = new Provider('https://beta-3.fuel.network/graphql');
  // setup wallet
  const wallet = Wallet.fromPrivateKey(process.env.WALLET_PRIVATE_KEY as string, provider);
  // instantiate predicate
  const predicate = BackendAbi__factory.createInstance(provider);
  // validation to satisfy predicate
  const predicateValidation: ValidationInput = {
    has_account: true,
    total_complete: 100,
  };
  
  useEffect(() => {
    const connectPredicate = async () => {

      predicate.setData(predicateValidation);

      const coinQuantity: CoinQuantityLike = { amount: 1_000_000, assetId: NativeAssetId};

      const resources = await predicate.getResourcesToSpend([coinQuantity]);

      const request = new ScriptTransactionRequest({ gasLimit: 1000, gasPrice: 1});

      request.addResources([resources[0]]);

      const response = await predicate.sendTransaction(request);

      console.log('response', response);
    }
    connectPredicate()
      .catch(console.error);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
