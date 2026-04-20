import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndustrialMonitor } from './industrial-monitor';

describe('IndustrialMonitor', () => {
  let component: IndustrialMonitor;
  let fixture: ComponentFixture<IndustrialMonitor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndustrialMonitor],
    }).compileComponents();

    fixture = TestBed.createComponent(IndustrialMonitor);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
