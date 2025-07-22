import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TnStructureComponent } from './tn-structure.component';

describe('TnStructureComponent', () => {
  let component: TnStructureComponent;
  let fixture: ComponentFixture<TnStructureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TnStructureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TnStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
