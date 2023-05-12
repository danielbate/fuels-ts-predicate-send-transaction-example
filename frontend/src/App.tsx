import React, { Component, useEffect } from "react";
import ReactDOM from "react-dom";
import logo from './logo.svg';
import './App.css';
import { Address, CoinStatus, JsonFlatAbi, NativeAssetId, Predicate, Provider, ScriptTransactionRequest, Wallet, WalletUnlocked, bn } from 'fuels';
import { BackendAbi__factory } from './types';

function App() {
  // Connect to testnet beta-3
  const provider = new Provider('https://beta-3.fuel.network/graphql');
  const predicate = BackendAbi__factory.createInstance(provider);

  
  useEffect(() => {
    const connectPredicate = async () => {
      // Reference test code: https://github.com/FuelLabs/fuels-ts/blob/eda13d72c32f72652a34f926c4b9cf42ac36556c/packages/predicate/src/predicate.test.ts#L96
      predicate.setData({has_account: true, total_complete: 100});
      // TODO add priv key
      const wallet = Wallet.fromPrivateKey("0x..", provider);

      const request = new ScriptTransactionRequest({ gasLimit: 1000, gasPrice: 1});

      // A coin is added
      request.addResources([{
        // id: '0x01' gives error "Invalid b256 (argument="b256", value="0x01", code=INVALID_ARGUMENT..""
        // this input gives error "Invalid struct UtxoId. Field "outputIndex" not present. (argument="UtxoId", value"
        id: '0x0000000000000000000000000000000000000000000000000000000000000001',
        assetId: NativeAssetId,
        amount: bn(1),
        owner: predicate.address,
        status: CoinStatus.Unspent,
        maturity: 1,
        blockCreated: bn(1),
      }]);
      console.log(request);
      
      /*
      This is one of the steps executed in predicate.sendTransaction(request)
      seems to be where the issue is

      Error: Invalid struct UtxoId. Field "outputIndex" not present. (argument="UtxoId", value={"transactionId":"0x0000000000000000000000000000000000000000000000000000000000000001"}, code=INVALID_ARGUMENT, version=0.41.0)
      */
      const a1 = request.toTransactionBytes();
      console.log(a1);

      /*
      Error: Invalid struct UtxoId. Field "outputIndex" not present. (argument="UtxoId", value={"transactionId":"0x0000000000000000000000000000000000000000000000000000000000000001"}, code=INVALID_ARGUMENT, version=0.41.0)
      */
      predicate.sendTransaction(request);
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
