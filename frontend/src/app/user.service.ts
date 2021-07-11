import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { User } from './user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private snackBar: MatSnackBar) { }

  readonly APIUrl ="http://127.0.0.1:3000/users/"

  private user: User = {
    id: '',
    name: ''
  }

  private userUpdated = new Subject<User>() 

  async register(user: object){
    let res: any = await this.http.post(this.APIUrl + "register/", user).toPromise()
    if (res.id != undefined){
      localStorage.setItem('id', res.id)
      await this.getUser()
      this.snackBar.open("Hi, " + res.username, "", {duration: 5000})  
    }
    else {
      this.snackBar.open(res.msg, "", {duration: 5000})  
      return
    }
  }

  async login(user: object) {
    let res : any = await this.http.post(this.APIUrl + "login/", user).toPromise()
    if (res.id != undefined){
      this.snackBar.open("Hi, " + res.username, "", {duration: 5000})  
    }
    else {
      this.snackBar.open(res.msg, "", {duration: 5000})  
      return
    }
    this.user.id = res.id
    this.userUpdated.next({...this.user})
    localStorage.setItem("id", res.id)
    
  }

  getUser() {
    let id: string = localStorage.getItem("id")!
    if (id){
      this.http.get(this.APIUrl + "profile/" + id + "/").toPromise()
        .then((res : any) => {
          this.user.id = id,
          this.user.name = res.username
          this.userUpdated.next({...this.user})
          return {...this.user}
        })
      }
    return {...this.user}
  }

  getUserUpdateListener() {
    return this.userUpdated.asObservable()
  }

  logout() {
    this.user = {
      id: '',
      name: ''
    }
    localStorage.removeItem('id')
    this.snackBar.open("You've logout", "", {duration: 5000})  
    this.userUpdated.next({...this.user})
  }
}
