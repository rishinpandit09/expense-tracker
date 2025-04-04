import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusinessDataService } from 'src/app/services/business-data.service';
import { AlertBoxComponent } from '../alert-box/alert-box.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit{
  user_name:any='';
  editable:boolean=false;
  isProcess:boolean=true;
  name:any='';
  lines:any=[];
  isEdit:boolean=false;
  newName:any;
  newUsername:any;
  userId:any;
  constructor(
    public businessData:BusinessDataService,
    public snackBar:MatSnackBar,
    public dialog: MatDialog
  ){}

  ngOnInit(): void {
    this.userId=sessionStorage.getItem('Id')?.split(' ')[1];
    this.isProcess=true;
    this.businessData.getAllSaveData().subscribe((res:any)=>{
      setTimeout(() => {
        this.isProcess=false;
        this.editable=true;
        if(this.userId===environment.adminId){
          this.editable=false;
        }
      }, 1000);
      let firstDate=(res.data.firstLoginDate).toString().split('T')[0];
      let lastLogin=(res.data.lastLoginDate).toString().split('T')[0];
      this.lines=[
        {content:'User Since',text:firstDate},
        {content:'Expense Logged',text:res.data.expenseLogged},
        {content:'Last Login',text:lastLogin},
      ];
      this.name=res.data.name;
      this.user_name=res.data.username;
      this.newName=res.data.name;
      this.newUsername=res.data.username;
    });
  }
  editField(){
    this.isEdit=!this.isEdit;
  }
  saveData(){
    let body={
      username:this.newUsername,
      name:this.newName,
    }
    this.businessData.updateProfile(body).subscribe((res:any)=>{
      if(res){
        this.businessData.updateWholeInfo(body).subscribe((result)=>{
          // console.log(result);
        });
        this.snackBar.open('Profile Updated','',{duration:2000});
      }
    },error=>{
      this.snackBar.open('Server Error','',{duration:2000});
    });
  }
  onDeleteAccount(){
    // console.log("delete");
    this.dialog.open(AlertBoxComponent, {
      data:{type:'delete'}
    });
  }
}
