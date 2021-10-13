import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TodoListModel } from 'src/app/models/todoListModel';
import { TaskModal } from 'src/app/models/todoListResponseModel';
import { HttpService } from 'src/app/services/http.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() viewMode = 'all';
  allTasks: TodoListModel[] = [];
  todayTasks: TodoListModel[] = [];
  todoList: TodoListModel[] = [];
  searchText = '';
  activeAccordian: string = '';
  isLoading = new BehaviorSubject<boolean>(false);
  completedTaskIndexes = new Set();
  subscription: Subscription = new Subscription();
  constructor(
    private httpService: HttpService,
    private modalService: NgbModal
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.todoList = this.viewMode === 'today' ? this.todayTasks : this.allTasks;
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.fetchToDoList();
  }

  toggleAccordian(dateIndex: number, taskIndex: number) {
    const indexString = dateIndex + '' + taskIndex;
    if (this.activeAccordian === indexString) this.activeAccordian = '';
    else this.activeAccordian = indexString;
  }

  openModalAddTask(content: any) {
    this.modalService.open(content);
  }
  isTaskComplete(dateIndex: number, taskIndex: number) {
    return this.completedTaskIndexes.has(dateIndex + '' + taskIndex);
  }
  toggleCheck(dateIndex: number, taskIndex: number) {
    const indexString = dateIndex + '' + taskIndex;
    if (this.completedTaskIndexes.has(indexString))
      this.completedTaskIndexes.delete(indexString);
    else this.completedTaskIndexes.add(indexString);
  }

  onTaskAdded() {
    this.fetchToDoList();
  }

  private fetchToDoList() {
    this.isLoading.next(true);
    this.subscription = this.httpService.getTodoList().subscribe(
      (data) => {
        console.log(data);

        let responseList: TaskModal[] = Object.values(data).sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        const dateSet = new Set<string>(
          responseList.map((r) => new Date(r.createdAt).toDateString())
        );
        this.allTasks = [];
        dateSet.forEach((date) =>
          this.allTasks.push({
            createdAt: date,
            taskList: responseList
              .filter((r) => new Date(r.createdAt).toDateString() === date)
              .map((r) => ({
                taskName: r.task_name,
                taskDescription: r.task_description,
              })),
          })
        );
        this.todoList = this.allTasks;
        this.todayTasks = this.allTasks.filter(
          (t) => t.createdAt == new Date().toDateString()
        );
        this.isLoading.next(false);
      },
      (error) => {
        console.log(error);
        this.isLoading.next(false);
      }
    );
  }
}
