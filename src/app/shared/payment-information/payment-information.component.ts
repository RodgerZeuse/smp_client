import { Component,  Input } from '@angular/core';
import { FormGroup, } from '@angular/forms';
import { RegisterUser } from '../sdk';

@Component({
  selector: 'payment-information',
  templateUrl: './payment-information.component.html',
  styleUrls: ['./payment-information.component.css'],
})

export class PaymentInformationComponent {
  @Input() paymentInformationForm:FormGroup;
  @Input() user:RegisterUser;

   cardMask = [/\d/, /\d/,/\d/,/\d/, '-',/\d/, /\d/,/\d/,/\d/, '-',/\d/, /\d/,/\d/,/\d/, '-',/\d/, /\d/,/\d/,/\d/];
   dateMask = [/\d/, /\d/, '/', /\d/, /\d/, /\d/, /\d/];
   cvvMask=[/\d/, /\d/, /\d/];
}
