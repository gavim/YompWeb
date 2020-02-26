import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  showItemDetail = false;
  currentItemId: any;

  constructor() {
  }

  ngOnInit() {
  }

  onItemSelected(selectedItem) {
    // change page css
    this.showItemDetail = true;
    this.currentItemId = selectedItem;
  }
}
