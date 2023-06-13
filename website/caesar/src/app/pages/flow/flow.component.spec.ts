import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlowComponent } from './flow.component';

describe('FlowComponent', () => {
  let component: FlowComponent;
  let fixture: ComponentFixture<FlowComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FlowComponent]
    });
    fixture = TestBed.createComponent(FlowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});