import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-searchbox',
  templateUrl: './searchbox.component.html',
  styleUrls: ['./searchbox.component.css']
})
export class SearchboxComponent implements OnInit {
  @Input() size: number;
  @Input() placeholder: string;
  @Output() inputChanged = new EventEmitter<string>();

  query = '';
  focusSearchBar = false;

  constructor() {
  }

  ngOnInit() {
    if (!this.size) {
      this.size = 50;
    }
    if (!this.placeholder) {
      this.placeholder = 'Search';
    }
  }

  updateSearch(value: string) {
    this.inputChanged.emit(value);
  }
}
