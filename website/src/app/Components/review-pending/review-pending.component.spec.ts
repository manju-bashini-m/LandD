import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewPendingComponent } from './review-pending.component';

describe('ReviewPendingComponent', () => {
  let component: ReviewPendingComponent;
  let fixture: ComponentFixture<ReviewPendingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewPendingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewPendingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
