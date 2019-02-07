import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

import { AngularFireAuth } from '@angular/fire/auth';

import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  form: FormGroup;
  public email = new FormControl('', [Validators.required]);
  public password = new FormControl('', [Validators.required]);

  constructor(private navCtrl: NavController, private fireAuth: AngularFireAuth, private formBuilder: FormBuilder) {
    this.form = this.formBuilder.group({
      email: this.email,
      password: this.password
  }); 
  }

  async onSubmit() {
    try {
      const result = await this.fireAuth.auth.signInWithEmailAndPassword(this.form.value.email, this.form.value.password);
      if(result.user.uid){
        this.navCtrl.navigateForward('/home');
      }
    } catch(e){
      console.error(e);
    }
  }

  ngOnInit() {
  }

}
