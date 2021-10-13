import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayFilter',
})
export class DayFilterPipe implements PipeTransform {
  transform(date: string) {
    if(new Date(date).toDateString() === new Date().toDateString())
    return 'Today';
    if(new Date(date).toDateString() === new Date(Date.now() - 864e5).toDateString())
    return 'Yesterday';
    return date;
  }
}
