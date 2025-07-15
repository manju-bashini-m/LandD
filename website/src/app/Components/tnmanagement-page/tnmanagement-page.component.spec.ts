import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TnmanagementPageComponent } from './tnmanagement-page.component';

describe('TnmanagementPageComponent', () => {
  let component: TnmanagementPageComponent;
  let fixture: ComponentFixture<TnmanagementPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TnmanagementPageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TnmanagementPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
