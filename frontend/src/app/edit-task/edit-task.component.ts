import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { MatSnackBar } from '@angular/material/snack-bar';
@Component({
  selector: 'app-edit-task',
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.scss']
})
export class EditTaskComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public task: Task, private tasksService: TasksService, private dialog : MatDialog, private snackBar: MatSnackBar) { }

  monday: boolean = this.task.repeatWeek.includes('monday')
  tuesday: boolean = this.task.repeatWeek.includes('tuesday')
  wednesday: boolean = this.task.repeatWeek.includes('wednesday')
  thursday: boolean = this.task.repeatWeek.includes('thursday')
  friday: boolean = this.task.repeatWeek.includes('friday')
  saturday: boolean = this.task.repeatWeek.includes('saturday')
  sunday: boolean = this.task.repeatWeek.includes('sunday')
  col : number = 0

  async ngOnInit() {
    this.task = {...this.task}
    if (!this.task.repeat){
      this.task.repeat = 1;
    }
  }

  async onRemoveTask(id: string, text: string) {
    await this.tasksService.removeTask(id)
    this.tasksService.getTasks()
    this.snackBar.open("You've delete " + text, "", {duration: 5000})
    this.dialog.closeAll();
  }

  onChangeRepeat(e : any){
    if (e.value < this.task.repeatDone){
      this.task.repeatDone = e.value
    }
  }

  async onEditTask(taskForm: NgForm) {
    let dayList : string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    let repeatWeek: string[] = [];
    dayList.forEach(day => {
      if (taskForm.value[day]) {
        repeatWeek.push(day)
      }
    });
    let task = {
      text : taskForm.value.text,
      repeat: taskForm.value.repeat,
      repeatDone: taskForm.value.repeatDone,
      repeatWeek: repeatWeek
    }
    await this.tasksService.editTask(this.task.id, task) 
    this.tasksService.getTasks()
    this.dialog.closeAll();
  }

  async onResetProgress(taskId: string){
    let res: any = await this.tasksService.resetProgress(taskId)
    this.tasksService.getTasks()
    this.dialog.closeAll();
    this.snackBar.open(res.msg, "", {duration: 5000})  
  }
}
