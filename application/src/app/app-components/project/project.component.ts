import { Component, OnInit, Input, NgZone } from '@angular/core';
import { Project } from '../../wrapper-objects/Project';
import { BlockfundService } from '../../services/blockfund.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';

@Component({
  selector: 'app-project',
  providers: [BlockfundService],
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {

  project: Project;

  contractCreatorAddress = '';
  contractInstanceAddress = '';
  name = '';
  shortDescription = '';
  longDescription = '';
  daysLeft = 0;
  hoursLeft = 0;
  limit: number;
  raised: number;
  myAmount: number;
  progressbar = '0';
  deadlineReached = false;
  mainAccHasFunded = false;

  mainAcc = '';

  blockfundService: BlockfundService;

  autoTicks = true;
  disabled = false;
  invert = false;
  max = 100;
  min = 0;
  showTicks = false;
  step = 1;
  thumbLabel = true;
  value = 0;
  vertical = false;
  validInput = false;
  fundAmount: number;

  constructor(
    blockfundService: BlockfundService,
    private route: ActivatedRoute,
    private _ngZone: NgZone,
    private router: Router
  ) {
    this.blockfundService = blockfundService;
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.contractInstanceAddress = params['id'];
      // Get project state from contract
      this.blockfundService.getProjectByAddress(this.contractInstanceAddress).subscribe( instance => {
        this.project = this.parseProject(instance, this.contractInstanceAddress);
        this.updateFields();
      });
      // get main account
      this.blockfundService.getMainAccount().subscribe(mainAcc => {
        if (mainAcc.length && mainAcc.length > 0) {
          this.mainAcc = mainAcc[0];
        } else {
          this.mainAcc = mainAcc;
        }
        // Get personal fund & wait for main account to arrive
        this.blockfundService.getMyPersonalFundAmount(
          this.contractInstanceAddress,
          this.mainAcc
        ).subscribe(amount => {
          this._ngZone.run(() => {
            this.myAmount = amount.toNumber();
            this.deadlineReached = ((this.daysLeft === 0) && (this.hoursLeft === 0));
            this.mainAccHasFunded = (this.myAmount !== 0);
          });
        });
      });
    });
  }

  // Parse return value to project object
  private parseProject(proj: any, projectAddress: string): Project {
    const date = new Date();
    const newSeconds = date.getSeconds() + (proj[6].toNumber());
    date.setSeconds(newSeconds);
    return new Project (
      proj[1],
      proj[0],
      proj[2],
      proj[3],
      date,
      proj[5],
      proj[4],
      projectAddress
    );
  }

  private updateFields(): void {
    try {
      this.contractCreatorAddress = this.project.getAddress();
      this.name = this.project.getName();
      this.shortDescription = this.project.getShortDescription();
      this.longDescription = this.project.getLongDescription();
      this.limit = this.project.getLimit();
      this.progressbar = this.project.getPaidPercentage().toString();
      this.daysLeft = this.project.getDaysLeft();
      this.hoursLeft = this.project.getHoursLeft();
      this.raised = this.project.getRaised();
      this.contractInstanceAddress = this.project.getProjectAddress();
      this.deadlineReached = ((this.daysLeft === 0) && (this.hoursLeft === 0));
      this.mainAccHasFunded = (this.myAmount !== 0);
    } catch (e) {
      console.warn('Update of the components field is not working properly. Please check your created proeject:');
      console.warn(this.project);
    }
  }

  valueChanged(): void {
    this.validInput = (this.fundAmount && this.fundAmount > 0);
  }

  sendFund(): void {
    if (this.validInput) {
      this.blockfundService.fund(
        this.fundAmount,
        this.mainAcc,
        this.contractInstanceAddress
      ).subscribe(result => {
        this.router.navigate(['/catalog']);
      });
    } else {
      console.warn('Amount "' + this.fundAmount  + '" not valid.');
    }
  }

  withdrawFund(): void {
    this.blockfundService.safeWithdrawal(this.mainAcc, this.contractInstanceAddress).subscribe();
  }

}
