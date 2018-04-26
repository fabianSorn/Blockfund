import { Component, OnInit, Input } from '@angular/core';
import { Project } from '../../../../wrapper-objects/Project';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-project-panel',
  templateUrl: './project-panel.component.html',
  styleUrls: ['./project-panel.component.css']
})
export class ProjectPanelComponent implements OnInit {

  @Input('project') project: Project;
  progressbar: string = "0";
  projectName: string = "";
  projectShortDescription: string = "";
  projectLimit: number = 0;
  projectRaised: number = 0;
  projectDays: number = 0;
  projectHours: number = 0;
  projectOwnerAddress: string = ""
  projectAddress: string = "";

  constructor() { }

  ngOnInit() {
    if(this.project !== undefined) {
      try {
        this.progressbar = this.project.getPaidPercentage().toString();
        this.projectName =  this.project.getName();
        this.projectShortDescription = this.project.getShortDescription();
        this.projectLimit = this.project.getLimit();
        this.projectRaised = this.project.getRaised();
        this.projectDays = this.project.getDaysLeft();
        this.projectHours = this.project.getHoursLeft();
        this.projectOwnerAddress = this.project.getAddress();
        this.projectAddress = this.project.getProjectAddress();

      } catch (err) {
        // console.warn('Error in Project Panel!');
      }
    }
  }

}
