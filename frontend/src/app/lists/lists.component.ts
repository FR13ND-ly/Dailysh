import { Component, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { MatDialog } from "@angular/material/dialog";
import { NewTaskComponent } from '../new-task/new-task.component';
import { TasksService } from '../tasks.service';
import { Task } from '../task.model';
import { EditTaskComponent } from '../edit-task/edit-task.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

  constructor(private dialog: MatDialog, private taskService: TasksService, private snackBar: MatSnackBar) { }

  tasks : any = [[]]
  doing: string[] = []
  loading: boolean = true

  async ngOnInit() {
    this.tasks = await this.taskService.getTasks()
    this.loading = false
    this.taskService.getTaksUpdateListener()
      .subscribe((tasks: Task[][]) => {
        this.loading = false
        this.tasks = tasks
      })
  }

  
  async drop(event: CdkDragDrop<string[]>){
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);
    }
    let order : any = {}
    event.container.data.forEach((task: any) => {
      order[event.container.data.indexOf(task)] = (task['id'])
    })
    let val : any = {
      order,
      col : parseInt(event.container.id.slice(-1)) + 1
    }
    await this.taskService.changeCol(val)
    this.taskService.getTasks()
  }

  onAddNewArticle() {
    this.dialog.open(NewTaskComponent, {
      autoFocus: true
    });
  }

  onEditArticle(task: Task) {
    this.dialog.open(EditTaskComponent, {
      autoFocus: true,
      data : task
    });
  }

  async onProgress(taskId: string){
    let res: any = await this.taskService.progress(taskId)
    if (res.msg != "Success" && res.msg.trim()) this.snackBar.open(res.msg, "", {duration: 5000})  
    this.taskService.getTasks()
  }
}
