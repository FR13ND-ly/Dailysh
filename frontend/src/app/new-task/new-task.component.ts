import { Component, OnInit, Inject } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Task } from '../task.model';
import { TasksService } from '../tasks.service';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-new-task',
  templateUrl: './new-task.component.html',
  styleUrls: ['./new-task.component.scss']
})
export class NewTaskComponent implements OnInit {

  constructor(private taskService: TasksService, private dialog: MatDialog, private snackBar: MatSnackBar) { }

  monday: boolean = true
  tuesday: boolean = true
  wednesday: boolean = true
  thursday: boolean = true
  friday: boolean = true
  saturday: boolean = true
  sunday: boolean = true

  ngOnInit(): void {
  }

  async onAddTask(taskForm : NgForm) {
    if (!taskForm.value.text.trim()){
      this.snackBar.open("Task field can't be empty", "", {duration: 5000})  
      return
    }
    let dayList : string[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    let repeatWeek: string[] = [];
    dayList.forEach(day => {
      if (taskForm.value[day]) {
        repeatWeek.push(day)
      }
    });
    let task :Task = {
      id: "0",
      userId : localStorage.getItem("id")!,
      text : taskForm.value.text,
      repeat: taskForm.value.repeat == "" ? 1 : taskForm.value.repeat,
      repeatDone: 1,
      repeatWeek: repeatWeek,
      disabled: false
    }
    
    await this.taskService.addTask(task)
    this.taskService.getTasks()
    this.dialog.closeAll();
  }
}
