import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputFormsPage } from './input-forms.page';

describe('InputFormsPage', () => {
  let component: InputFormsPage;
  let fixture: ComponentFixture<InputFormsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputFormsPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputFormsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
