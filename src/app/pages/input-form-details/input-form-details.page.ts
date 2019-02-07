import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { InputForm } from 'src/app/models/inputForm.interface';
import { AngularFirestoreDocument, AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { map } from 'rxjs/operators';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { AlertController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-input-form-details',
  templateUrl: './input-form-details.page.html',
  styleUrls: ['./input-form-details.page.scss'],
})
export class InputFormDetailsPage implements OnInit {

  public inputForm: Observable<InputForm>;
  public inputFormId: string;
  public files: Observable<any[]>;

  constructor(private route: ActivatedRoute, private navCtrl: NavController, private alertController: AlertController, private fireAuth: AngularFireAuth, public firestore: AngularFirestore, private iab: InAppBrowser, private afStorage: AngularFireStorage) { }

  
  getInputFormDetail(inputFormId: string): AngularFirestoreDocument<InputForm> {
    return this.firestore.collection(`users/${this.fireAuth.auth.currentUser.uid}/inputForms`).doc(inputFormId);
  }
  
  ngOnInit() {    
    this.inputForm = this.getInputFormDetail(this.inputFormId = this.route.snapshot.paramMap.get('id')).valueChanges();
    this.files = this.getFiles();
  }

  getFiles() {
    let ref = this.firestore.collection(`users`).doc(this.fireAuth.auth.currentUser.uid).collection("inputForms").doc(this.inputFormId).collection("files");

    return ref.snapshotChanges().pipe(map(changes => {
      return changes.map(c => {
        const data = c.payload.doc.data();
        const id = c.payload.doc.id;
        console.log('>>>>', { id, ...data });
        return { id, ...data };
      });
    }));
  }

  viewFile(file) {
    this.afStorage.ref(file).getDownloadURL().subscribe(fileLink => {this.iab.create(fileLink, "_system"); 
    console.log(fileLink)});     
  }

  async deleteReceipt() {
    const alert = await this.alertController.create({
      message: 'Are you sure you want to delete the receipt?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          },
        },
        {
          text: 'Okay',
          handler: () => {
            this.deleteReceipt1(this.inputFormId).then(() => {             
                this.navCtrl.navigateForward('input-forms');
            });
          },
        },
      ],
    });
    
    await alert.present();
  }

  deleteReceipt1(inputFormId: string): Promise<void> {
    // this.afStorage.ref('files'). //delete files
    return this.firestore.doc(`users/${this.fireAuth.auth.currentUser.uid}/inputForms/${inputFormId}`).delete();
  }
}
