import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  readonly APIUrl ="http://127.0.0.1:3000/tasks/"
  constructor(private http: HttpClient) { }
  private tasks : any = [
    [
      { id: "bv", text: "bla bla bla", repeat : 1, repeatDone : 1, repeatWeek: [] },
      { id: "abv", text: "la la la", repeat : 1, repeatDone : 1, repeatWeek: [] }
    ],
    [
    ],
    [
      { id: "cbv", text: "nla nla nla", repeat : 1, repeatDone : 1, repeatWeek: [] },
      { id: "vdsbv", text: "na na na", repeat : 1, repeatDone : 1, repeatWeek: []}
    ],
  ]

  private tasksUpdated = new Subject<Task[][]>() 

  async getTasks() {
    this.tasks = await this.http.get(this.APIUrl + localStorage.getItem('id') + "/").toPromise()
    this.tasksUpdated.next([...this.tasks])
    return [...this.tasks]
  }

  getTaksUpdateListener() {
    return this.tasksUpdated.asObservable()
  }

  async addTask(task: Task){
    await this.http.post(this.APIUrl + "create", task).toPromise()
  }

  removeTask(id: string){
    return this.http.delete(this.APIUrl + `delete/${id}`).toPromise()
  }

  changeCol(val: any){
    return this.http.put(this.APIUrl + "changeCol", val).toPromise()
  }

  async editTask(id : string, task: object){
    await this.http.put(this.APIUrl + `edit/${id}`, task).toPromise()
  }

  progress(id : string){
    return this.http.put(this.APIUrl + "progress/", {id}).toPromise()
  }

  resetProgress(id: string){
    return this.http.put(this.APIUrl + "resetProgress/", {id}).toPromise()
  }
}
