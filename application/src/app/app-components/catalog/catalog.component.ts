import { Component, OnInit } from '@angular/core';
import { Project } from '../../wrapper-objects/Project';
import { BlockfundService } from '../../services/blockfund.service';

@Component({
  selector: 'app-catalog',
  providers: [BlockfundService],
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css'],
})

export class CatalogComponent implements OnInit {

  projects: Project[];
  blockfundService: BlockfundService;

  constructor(blockfundService: BlockfundService) {
    this.blockfundService = blockfundService;
  }

  ngOnInit() {
    this.blockfundService.getProjects().subscribe(projects => {
      this.buildProjectObjects(projects);
    });
  }

  private buildProjectObjects(projects: any) {
    if (projects !== undefined && projects.length) {
      this.projects = [projects.length];
      for (let i = 0; i < projects.length; i++) {
        const projectAdress = projects[i];
        this.blockfundService.getProjectByAddress(projectAdress).subscribe( instance => {
          this.projects[i] = this.parseProject(instance, projectAdress);
        });
      }
    }
  }

  // Parse return value to project object
  private parseProject(proj: any, projectAddress: string): Project {
    let date = new Date();
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

}
