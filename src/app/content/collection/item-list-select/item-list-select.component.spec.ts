import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemListSelectComponent } from './item-list-select.component';

describe('ItemListSelectComponent', () => {
  let component: ItemListSelectComponent;
  let fixture: ComponentFixture<ItemListSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemListSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemListSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
