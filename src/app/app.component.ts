import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {jewelTypes, variants} from './data';
import {HttpClient} from "@angular/common/http";
import {tap} from "rxjs/operators";
import {Observable} from "rxjs";

const SERVER_URL = 'http://3.66.231.75:3000/';
const formBuilder = new FormBuilder();
const defaultWeightControl = {
  key: ['', [Validators.required]],
  value: [1, [Validators.required]]
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  types = jewelTypes;
  result: Observable<any>;

  constructor(private httpClient: HttpClient) {
  }

  ngOnInit(): void {
    this.form = formBuilder.group({
      type: [this.types[0], [Validators.required]],
      ids: formBuilder.array([null]),
      weights: formBuilder.array([
        formBuilder.group(defaultWeightControl)
      ])
    })
  }

  get weightKeys() {
    const type = this.form.get('type').value;
    return variants[type];
  }


  get weightsArray() {
    return (<FormArray>this.form.get('weights'));
  }


  addWeight() {
    this.weightsArray.push(formBuilder.group(defaultWeightControl))
  }

  removeWeight(i: number) {
    this.weightsArray.removeAt(i);
  }


  get idsArray() {
    return (<FormArray>this.form.get('ids'));
  }

  addId() {
    this.idsArray.push(formBuilder.control(null))
  }

  removeId(i: number) {
    this.idsArray.removeAt(i);
  }

  toControl(absCtrl: AbstractControl): FormControl {
    const ctrl = absCtrl as FormControl;
    // if(!ctrl) throw;
    return ctrl;
  }

  onSubmit() {
    if (this.form.invalid) {
      console.error('form invalid')
      return;
    }
    const data = this.form.getRawValue();
    const weights = Object.fromEntries(data.weights.map(weight => [weight.key, weight.value]));
    const requestData = {...data, weights};
    this.result = this.httpClient.post(SERVER_URL, requestData).pipe(tap(console.log))
  }
}
