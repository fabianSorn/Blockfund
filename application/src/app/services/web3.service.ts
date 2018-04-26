import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { fromPromise } from 'rxjs/observable/fromPromise';

import { environment } from '../environments/environment';

const Web3 = require('web3');

declare var window: any;

@Injectable()
export class Web3Service {

  public web3: any;

  constructor() {
    this.checkAndInstantiateWeb3();
  }

  checkAndInstantiateWeb3 = () => {
    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof window.web3 !== 'undefined') {
      console.log(
        `[INFO]: Using injected Web3 instance`
      );
      // Use Mist/MetaMask's provider
      // Provided web3 does not work properly
      this.web3 = new Web3(window.web3.currentProvider);
    } else {
      console.log(
        `[INFO]: No web3 detected. Falling back to ${environment.HttpProvider}.`
      );
      // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
      this.web3 = new Web3(
        new Web3.providers.HttpProvider(environment.HttpProvider)
      );
    }
  }

  getAccounts(): Observable<any> {
    return Observable.create(observer => {
      this.web3.eth.getAccounts((err, accs) => {
        // check i web3 is correctly injected
        console.log(this.web3);

        if (err != null) {
          observer.error('There was an error fetching your accounts.');
        }

        if (accs.length === 0) {
          observer.error('Couldn\'t get any accounts! Make sure your Ethereum client is configured correctly.');
        }

        observer.next(accs);
        observer.complete();
      });
    });
  }

}
