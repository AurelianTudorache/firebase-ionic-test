import { Component, OnInit } from '@angular/core';
import { InputForm } from 'src/app/models/inputForm.interface';

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Component({
  selector: 'app-input-forms',
  templateUrl: './input-forms.page.html',
  styleUrls: ['./input-forms.page.scss'],
})
export class InputFormsPage implements OnInit {

  public inputForms;
  public inputForm;

  constructor(private fireAuth: AngularFireAuth, public firestore: AngularFirestore) { }

  ngOnInit() {
    this.inputForms = this.getInputForms().valueChanges();
  }


  getInputForms(): AngularFirestoreCollection<InputForm> { 
      return this.firestore.collection(`users/${this.fireAuth.auth.currentUser.uid}/inputForms`);
    
  }
}
