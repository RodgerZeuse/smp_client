import { NgModule } from '@angular/core';
import {
    MatNativeDateModule,
    MatSnackBarModule, MatIconModule,
    MatDialogModule, MatButtonModule,
    MatPaginatorModule, MatSortModule, MatTabsModule,
    MatCheckboxModule, MatToolbarModule, MatCardModule, MatBadgeModule,
    MatTooltipModule, MatFormFieldModule, MatChipsModule, MatProgressSpinnerModule,
    MatInputModule, MatMenuModule, MatSidenavModule, MatButtonToggleModule, MatListModule, MatSlideToggleModule
} from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatStepperModule } from '@angular/material/stepper'
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table'

@NgModule({
    imports: [MatSlideToggleModule, MatTabsModule, MatBadgeModule, MatSortModule, MatButtonToggleModule, MatSidenavModule, MatTooltipModule, MatChipsModule, MatMenuModule, MatTableModule, MatStepperModule, MatDividerModule, MatSliderModule, MatSelectModule, MatRadioModule, MatNativeDateModule, MatDatepickerModule, MatSnackBarModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatButtonModule, MatSortModule, MatTableModule, MatTabsModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatFormFieldModule, MatProgressSpinnerModule, MatInputModule, MatPaginatorModule, MatListModule],
    exports: [MatSlideToggleModule, MatTabsModule, MatBadgeModule, MatSortModule, MatButtonToggleModule, MatSidenavModule, MatMenuModule, MatTooltipModule, MatChipsModule, MatDividerModule, MatTableModule, MatStepperModule, MatSliderModule, MatSelectModule, MatRadioModule, MatNativeDateModule, MatDatepickerModule, MatSnackBarModule, MatIconModule, MatDialogModule, MatProgressSpinnerModule, MatButtonModule, MatSortModule, MatCheckboxModule, MatToolbarModule, MatCardModule, MatTableModule, MatTabsModule, MatFormFieldModule, MatProgressSpinnerModule, MatInputModule, MatPaginatorModule, MatListModule],

})
export class MaterialModule { }