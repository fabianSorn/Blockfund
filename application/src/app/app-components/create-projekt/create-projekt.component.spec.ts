import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProjektComponent } from './create-projekt.component';

describe('CreateProjektComponent', () => {
  let component: CreateProjektComponent;
  let fixture: ComponentFixture<CreateProjektComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateProjektComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateProjektComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
