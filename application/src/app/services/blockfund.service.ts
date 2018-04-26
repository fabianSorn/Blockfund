import { Project } from '../wrapper-objects/Project';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { filter } from 'rxjs/operators';
import { Web3Service } from './web3.service';

const blockfundArtifacts =  require('../../../build/contracts/Blockfund.json');
const projectArtifacts =    require('../../../build/contracts/Project.json');
const contract = require('truffle-contract');

@Injectable()
export class BlockfundService {

    private web3Service: Web3Service;
    Blockfund = contract(blockfundArtifacts);

    constructor( web3Service: Web3Service, private _ngZone: NgZone ) {
      this.web3Service = web3Service;
      this.Blockfund.setProvider(this.web3Service.web3.currentProvider);
    }

    public getAccounts(): Observable<any> {
      return this.web3Service.getAccounts().pipe(filter(acc => (
        (acc !== null) && (acc.length)
      )));
    }

    public getMainAccount(): Observable<any> {
      return this.web3Service.getAccounts().pipe(filter(acc => (
        (acc !== null) && (acc.length) && (acc.length >= 1)
      )));
    }

    // ~~~~~~~~~~~~~~~~~~~~~~ Mock Contract ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    public getProjects(): Observable<Project[]> {
        let blockfundInstance;
        return Observable.create(observer => {
          this.Blockfund
            .deployed()
            .then(instance => {
              blockfundInstance = instance;
              return blockfundInstance.getAllExistingProjects.call();
            })
            .then(value => {
              observer.next(value);
              console.log(value);
              observer.complete();
            })
            .catch(e => {
              console.log(e);
              observer.error(e);
            });
        });
    }

    // ~~~~~~~~~~~~~~~~~~~~~~ Contract interaction ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

    /**
     * Reads state of specific project contract for building a Project-Object
     */
    public getProjectByAddress(address: string): Observable<object> {
      let contractInstance;
      return Observable.create(observer => {
        // Set Project to instance at sepcific adress
        let projectInstance = contract(projectArtifacts);
        projectInstance.setProvider(this.web3Service.web3.currentProvider);
        projectInstance = projectInstance.at(address).then(instance => {
              contractInstance = instance;
              return contractInstance.getProjectInformation.call();
            })
            .then(value => {
              observer.next(value);
              observer.complete();
            })
            .catch(e => {
              console.log(e);
              observer.error(e);
            });
      });
    }

    /**
     * Reads state of specific project contract for building a Project-Object
     */
    public getMyPersonalFundAmount(
      contractInstanceAddress: string,
      fundersAddress: string
    ): Observable<any> {
      let contractInstance;
      return Observable.create(observer => {
        // Set Project to instance at sepcific adress
        let projectInstance = contract(projectArtifacts);
        projectInstance.setProvider(this.web3Service.web3.currentProvider);
        projectInstance.defaults({from: fundersAddress});
        projectInstance = projectInstance.at(contractInstanceAddress).then(instance => {
              contractInstance = instance;
              return contractInstance.getMyPersonalFundAmount.call(fundersAddress);
            })
            .then(value => {
              observer.next(value);
              observer.complete();
            })
            .catch(e => {
              console.log(e);
              observer.error(e);
            });
      });
    }

    public createNewProject(
      name: string,
      shortDescription: string,
      longDescription: string,
      duration: number,
      goal: number,
      address: string
    ): Observable<object> {
      let blockfundInstance;
        return Observable.create(observer => {
          this.Blockfund
            .deployed()
            .then(instance => {
              blockfundInstance = instance;
              this.Blockfund.defaults({from: address});
              return blockfundInstance.createNewProject(
                name,
                shortDescription,
                longDescription,
                duration,
                goal
              );
            })
            .then(value => {
              observer.next(value);
              observer.complete();
            })
            .catch(e => {
              console.log(e);
              observer.error(e);
            });
        });
    }

    // Payable amount in ether
    public fund(
      amount: number,
      funder: string,
      contractInstanceAddress: string
    ): Observable<object> {
      let contractInstance;
      const transactionParams = {
        from: funder,
        to: contractInstanceAddress,
        value: this.web3Service.web3.toWei(amount, 'ether')
      };
      return Observable.create(observer => {
        // Set Project to instance at sepcific adress
      let projectInstance = contract(projectArtifacts);
      projectInstance.setProvider(this.web3Service.web3.currentProvider);
      projectInstance = projectInstance.at(contractInstanceAddress).then(instance => {
            contractInstance = instance;
            return contractInstance.sendTransaction(transactionParams);
          })
          .then(value => {
            observer.next(value);
            console.log('New Transaction for project', contractInstanceAddress, 'with amount', amount, 'from address', funder);
            observer.complete();
          })
          .catch(e => {
            console.log(e);
            observer.error(e);
          });
      });
    }

    // Payable amount in ether
    public safeWithdrawal(
      funder: string,
      contractInstanceAddress: string
    ): Observable<object> {
      let contractInstance;
      return Observable.create(observer => {
        // Set Project to instance at sepcific adress
      let projectInstance = contract(projectArtifacts);
      projectInstance.setProvider(this.web3Service.web3.currentProvider);
      projectInstance = projectInstance.at(contractInstanceAddress).then(instance => {
            contractInstance = instance;
            return contractInstance.safeWithdrawal();
          })
          .then(value => {
            observer.next(value);
            console.log('Withdraw fund of contract', contractInstanceAddress, 'for address', funder);
            observer.complete();
          })
          .catch(e => {
            console.log(e);
            alert('The amount could not be safed. Please check, if the project is really over.');
            observer.error(e);
          });
      });
    }

}
