import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { CatalogComponent } from './app-components/catalog/catalog.component';
import { ProjectComponent } from './app-components/project/project.component';
import { PageNotFoundComponent } from './app-components/page-not-found/page-not-found.component';
import { ProjectPanelComponent } from './app-components/catalog/components/project-panel/project-panel.component';
import { CreateProjektComponent } from './app-components/create-projekt/create-projekt.component';
import { BlockfundService } from './services/blockfund.service';
import { Web3Service } from './services/web3.service';

import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material';
import { MatSliderModule } from '@angular/material/slider';
import { ErrorStateMatcher } from '@angular/material/core';

const appRoutes: Routes = [
  { path: 'catalog', component: CatalogComponent },
  { path: 'create', component: CreateProjektComponent },
  { path: 'project/:id', component: ProjectComponent },
  { path: '',   redirectTo: '/catalog', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    CatalogComponent,
    ProjectComponent,
    PageNotFoundComponent,
    ProjectPanelComponent,
    CreateProjektComponent
  ],
  imports: [
    RouterModule.forRoot(
      appRoutes,
      { enableTracing: false }
    ),
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpModule,
    MatProgressBarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSliderModule
  ],
  providers: [
    BlockfundService,
    ErrorStateMatcher,
    Web3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
