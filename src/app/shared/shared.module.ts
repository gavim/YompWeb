import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterPipe } from './filter.pipe';
import { SearchboxComponent } from './searchbox/searchbox.component';
import { FormsModule } from '@angular/forms';
import { ClrIconModule } from '@clr/angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClrIconModule
  ],
  declarations: [
    FilterPipe,
    SearchboxComponent
  ],
  exports: [
    CommonModule,
    FilterPipe,
    SearchboxComponent
  ]
})
export class SharedModule {
}
