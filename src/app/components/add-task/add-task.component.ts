import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { TaskModal } from 'src/app/models/todoListResponseModel';
import { HttpService } from 'src/app/services/http.service';
import * as uuid from 'uuid';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
})
export class AddTaskComponent implements OnInit, OnDestroy {
  taskForm: FormGroup = new FormGroup({
    taskName: new FormControl('', [Validators.required]),
    taskDescription: new FormControl('', [
      Validators.required,
      Validators.minLength(50),
      Validators.maxLength(250),
    ]),
  });
  @Output() taskAddedEvent = new EventEmitter();
  subscription: Subscription = new Subscription();

  constructor(
    private modalService: NgbModal,
    private httpService: HttpService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}

  onSubmit() {
    if (this.taskForm.invalid) return;
    const task: TaskModal = {
      id: uuid.v4(),
      createdAt: new Date().toISOString(),
      task_name: this.taskForm.get('taskName')?.value,
      task_description: this.taskForm.get('taskDescription')?.value,
    };
    this.subscription = this.httpService.addTask(task).subscribe(
      (res) => {
        this.modalService.dismissAll();
        this.taskAddedEvent.emit();
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
