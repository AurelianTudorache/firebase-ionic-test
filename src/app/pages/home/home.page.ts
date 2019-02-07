import { Component, OnInit } from '@angular/core';
import { ToastController, Platform } from '@ionic/angular';

import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
;
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from "@ionic-native/file-path/ngx";

import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  form: FormGroup;
  public input1 = new FormControl('', [Validators.required]);
  public input2 = new FormControl('', [Validators.required]);
  public input3 = new FormControl('', [Validators.required]);
  
  nativepath: any;
  formId = this.firestore.createId();

  constructor(
    private fireAuth: AngularFireAuth, 
    private afStorage: AngularFireStorage, 
    public plt: Platform, 
    private filePath: FilePath, 
    private formBuilder: FormBuilder,
    private fileChooser: FileChooser, 
    public firestore: AngularFirestore, 
    private toastCtrl: ToastController) { 

      this.form = this.formBuilder.group({
        input1: this.input1,
        input2: this.input2,
        input3: this.input3
    }); 

  }

  onSubmit(): Promise<void> {
    console.log('createInputForm called');
    console.log(this.form);
    const id = this.formId;    
    const uid = this.fireAuth.auth.currentUser.uid;

    return this.firestore.collection('users').doc(uid).collection('inputForms').doc(id).set({
      id,
      input1: this.form.value.input1,
      input2: this.form.value.input2,
      input3: this.form.value.input3,
      timeCreated: new Date(),
    }, {merge: true});
  }
   

  pickFile() {
    var promise;
    if (this.plt.is("android")) {
      promise = new Promise((resolve, reject) => {
        this.fileChooser.open().then(url => {
          this.filePath.resolveNativePath(url).then(result => {
            this.nativepath = result;
            (<any>window).resolveLocalFileSystemURL(this.nativepath, res => {
              console.log(res);
              res.file(resFile => {
                var reader = new FileReader();
                reader.readAsArrayBuffer(resFile);
                reader.onloadend = (evt: any) => {
                  var imgBlob = new Blob([evt.target.result], {
                    type: "application/pdf"
                  });
                  var imageStore = this.afStorage
                    .ref("/files")
                    .child(this.fireAuth.auth.currentUser.uid)
                    .child(this.formId)
                    .child(res.name);
                  imageStore
                    .put(imgBlob)
                    .then(res => {
                      this.storeInfoToDatabase(res.metadata);
                    })
                    .catch(err => {
                      reject(err);
                    });
                };
              });
            });
          });
        });
      });
    }   
    
    return promise;
  }

  storeInfoToDatabase(metainfo) {
    let toSave = {
      created: metainfo.timeCreated,
      fullPath: metainfo.fullPath,
      contentType: metainfo.contentType
    }
    return this.firestore.collection('users').doc(this.fireAuth.auth.currentUser.uid).collection('inputForms').doc(this.formId).collection('files').add(toSave);
  }

  ngOnInit() {
    this.fireAuth.authState.subscribe(async data => {
      if(data && data.email && data.uid) {
        const toast: any = await this.toastCtrl.create({
          message: `Welcome , ${data.email}`,
          duration: 5000
        })
        toast.present();
      } else {
       const toast: any = this.toastCtrl.create({
         message: 'Counld not find auth details',
         duration: 5000
       })
       toast.present();
      }
   });
 }
}
