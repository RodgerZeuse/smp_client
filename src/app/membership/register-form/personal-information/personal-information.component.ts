import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { RegisterUser } from '../../../shared/sdk';

@Component({
  selector: 'personal-information',
  templateUrl: './personal-information.component.html',
  styleUrls: ['./personal-information.component.css']
})

export class PersonalInformationComponent {
  @Input() personInformationForm: FormGroup;
  @Input() user: RegisterUser;
}
