import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LostPassComponent } from './lost-pass.component';

describe('LostPassComponent', () => {
  let component: LostPassComponent;
  let fixture: ComponentFixture<LostPassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LostPassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LostPassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
