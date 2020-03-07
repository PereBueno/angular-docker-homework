import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QualityGateComponent } from './quality-gate.component';

describe('QualityGateComponent', () => {
  let component: QualityGateComponent;
  let fixture: ComponentFixture<QualityGateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QualityGateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QualityGateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
