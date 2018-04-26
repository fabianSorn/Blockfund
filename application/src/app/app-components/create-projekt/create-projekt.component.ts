import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Project } from '../../wrapper-objects/Project';
import { Router } from '@angular/router';
import { BlockfundService } from '../../services/blockfund.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { delay } from 'q';

@Component({
  selector: 'app-create-projekt',
  templateUrl: './create-projekt.component.html',
  providers: [BlockfundService],
  styleUrls: ['./create-projekt.component.css']
})
export class CreateProjektComponent implements OnInit {

  // Project input field
  name: string;
  address: any;
  shortDescription: string;
  longDescription: string;
  goal: number;
  duration: number;
  // Services
  blockfundService: BlockfundService;
  // Duration Slider Configuration
  autoTicks = true;
  disabled = false;
  invert = false;
  max = 30;
  min = 1;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;
  // is the formular valid
  validInput = false;

  addressErrorLabel = 'Please check your MetaMask or Mist Configuration beacuse we could not find any addresses.';
  private addressEditable: boolean;

  constructor(blockfundService: BlockfundService, private router: Router, private _ngZone: NgZone) {
    this.blockfundService = blockfundService;
  }

  ngOnInit() {
    this.address = null;
    this.addressEditable = true;
    this.blockfundService.getMainAccount().subscribe(accounts => {
      // Shows Accounts when loaded
      this._ngZone.run(() => {
        this.address = accounts[0];
        this.addressEditable = false;
      });
    });
  }

  valueChanged(): void {
    this.validInput = (
      (this.name !== undefined)
      && (this.name.length > 0)
      && (this.address !== undefined)
      && (this.address.length > 0)
      && (this.duration !== undefined)
      && (this.shortDescription !== undefined)
      && (this.shortDescription.length > 0)
      && (this.longDescription !== undefined)
      && (this.longDescription.length > 0)
      && (this.duration <= this.max)
      && (this.duration >= this.min)
      && (this.goal)
      && (this.goal > 0)
    );
  }

  createProject(): void {
    if (this.validInput) {
      // Check if hex-prefix is already at the start of the address
      if (this.address.indexOf('0x') !== 0) {
        this.address = '0x' + this.address;
      }
      this.blockfundService.createNewProject(
        this.name,
        this.shortDescription,
        this.longDescription,
        this.duration,
        this.goal,
        this.address
      ).subscribe(value => {
        console.log('A new project contract was deployed under the address: ', value);
        this.router.navigate(['/catalog']);
      });
    } else {
      console.warn('The formular was not filled out correctly. Check following inputs:');
      console.warn('- name:              ', this.name);
      console.warn('- address:           ', this.address);
      console.warn('- short description: ', this.shortDescription);
      console.warn('- long description : ', this.longDescription);
      console.warn('- name:              ', this.goal);
      console.warn('- duration:          ', this.duration);
    }
  }

}
