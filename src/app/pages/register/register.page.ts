import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';

import { FormControl, Validators, FormGroup, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {

  form: FormGroup;
  public email = new FormControl('', [Validators.required]);
  public name = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);
  public confirmPassword = new FormControl('', [Validators.required]);
  
  constructor(private fireAuth: AngularFireAuth, private angularFirestore: AngularFirestore, private navCtrl: NavController, private toastCtrl: ToastController, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      email: this.email,
      name: this.name,
      password: this.password,
      confirmPassword: this.confirmPassword
   }); 
  }

  async onSubmit() {
    var usersCollection = this.angularFirestore.collection('users');
    var toast: any;
    if(this.form.value.password !== this.form.value.confirmPassword) {
      toast = await this.toastCtrl.create({
        message:'Password and Confirm Password fields must match', 
        duration: 5000
      })
      toast.present();
      return;
    }
    try {
      this.fireAuth.auth.createUserWithEmailAndPassword(this.form.value.email, this.form.value.password)
      .then(response => {
        console.log(response);
        usersCollection.doc(response.user.uid)
        .set({
          name: this.form.value.name,
          firebaseAuthId: response.user.uid
        })
        .then(() => {
            console.log("Document successfully written!");
            this.navCtrl.navigateForward('/home');
        })
        .catch(error => {
            console.error("Error writing document: ", error);
        });
      })
      .catch(async err => {
        console.log(err);
        
        switch (err.code) {
          case 'auth/email-already-in-use':
          toast = await this.toastCtrl.create({
            message: 'A user with this email already exists', 
            duration:5000
          })
          toast.present();
            break
          case 'auth/invalid-email':
          toast = await this.toastCtrl.create({
            message: 'The email address is badly formatted', 
            duration: 5000
          })
          toast.present();
            break
          case 'auth/weak-password':
          toast = await this.toastCtrl.create({
            message: 'Password should be atleast 6 characters',
            duration: 5000
          })
          toast.present();
            break;
          default:
        }
      })

    } catch (FirebaseAuthWeakPasswordException) {
      
      toast = await this.toastCtrl.create({
        message: 'Password should be atleast 6 characters',
        duration: 5000
      })
      toast.present();
    }
  }       

  ngOnInit() {
  }

}
