import { Pipe, PipeTransform } from '@angular/core';
import { TaskDetail } from '../models/taskDetailModel';

@Pipe({
  name: 'searchFilter'
})
export class SearchFilterPipe implements PipeTransform {

  transform(todoList: TaskDetail[], searchText: string): TaskDetail[] {
    // if(!searchText)
    // return todoList;
    // if(!todoList)
    // return [];
    return todoList.filter(tl => tl.taskName.toLowerCase().includes(searchText.toLowerCase()));
  }

}
