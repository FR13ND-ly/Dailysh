import { Component, HostBinding, OnInit } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UserService } from './user.service';
import { User } from './user.model';
import { NgForm } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  isDarkTheme: boolean = false
  @HostBinding('class') componentCssClass: string | undefined;
  
  constructor(public overlayContainer: OverlayContainer, private userService: UserService, private snackBar: MatSnackBar){}
  user: User = {
    id: '',
    name: ''
  }
  loginOrRegister: boolean = true

  ngOnInit(){
    this.isDarkTheme = localStorage.getItem('isDarkTheme') == "dark-theme"
    this.onChangeTheme()
    this.user = this.userService.getUser()
    this.userService.getUserUpdateListener()
      .subscribe((user: User) => {
        this.user = user
      })
  }

  onChangeTheme(){
    let theme = this.isDarkTheme ? "light-theme" : "dark-theme"
    document.body.className = "mat-typography " + theme
    this.componentCssClass = theme;
    localStorage.setItem('isDarkTheme', this.isDarkTheme ? "dark-theme" : "light-theme")
    this.isDarkTheme = !this.isDarkTheme
  }

  onLogin(loginForm : NgForm){
    this.userService.login(loginForm.value)
  }

  onRegister(registerForm : NgForm){
    this.userService.register(registerForm.value)
  }

  onLogout(){
    this.userService.logout()
    this.loginOrRegister = true
  }
}
