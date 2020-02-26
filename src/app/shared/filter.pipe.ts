import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
  pure: false
})
export class FilterPipe implements PipeTransform {

  constructor() {
  }

  transform(value: any, query: string, ...properties: string[]): any {
    if (!value) {
      return value;
    }
    for (const property of properties) {
      if (!value[property]) {
        return false;
      }
      if ((value[property].toLowerCase()).indexOf(query) !== -1) {
        return true;
      }
    }
    return false;
  }
}
