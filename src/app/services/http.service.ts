import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TaskModal } from '../models/todoListResponseModel';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private API_URL = "https://todo-7117b-default-rtdb.firebaseio.com/tasks.json";
  constructor(private http: HttpClient) { }

  getTodoList() {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.get(this.API_URL, {
      headers: httpHeaders,
    });
  }

  addTask(task: TaskModal) {
    const httpHeaders = new HttpHeaders({
      "Content-Type": "application/json",
    });
    return this.http.post(this.API_URL,task, {
      headers: httpHeaders
    });
  }
}
