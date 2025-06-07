import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DataService } from '../data.service';

@Component({
  selector: 'app-meetings',
  templateUrl: './meetings.component.html',
  styleUrls: ['./meetings.component.css']
})
export class MeetingsComponent {

  registerForm: FormGroup; //If you get error for this line add strictPropertyInitialization: false in tsconfig.json.
  submitted: boolean = false;
  meetings: any = [];
  clients: any = [];
  isUpdating: boolean = false;
  selectedIndex: number = -1;
  showSuccessAlert: boolean = false;
  successMessage: string = "";

  constructor(private builder: FormBuilder, private service: DataService) { }

  ngOnInit() {
    this.getClients();
    this.getMeetings();
    this.registerForm = this.builder.group({
      topic: ['', Validators.required],
      clientId: ['', [Validators.required]],
      startDate: ["", [Validators.required]],
      endDate: ['', [Validators.required]],
      peopleCount: ['', [Validators.required]]
    });
  }

  get form() {
    return this.registerForm.controls;
  }

  getClients = () => {
    this.service.getClients().subscribe(results => { this.clients = results });
  }

  getMeetings = () => {
    this.service.getMeetings().subscribe(results => {
      this.meetings = results;
      console.log(this.meetings);
    });
  }

  addMeeting = (meeting: any) => {
    this.service.addMeeting(meeting).subscribe(() => this.getMeetings());
  }

  updateMeeting = (meeting: any, meetingID: number) => {
    this.service.updateMeeting(meeting, meetingID).subscribe(() => this.getMeetings());
  }

  deleteMeeting = (id: number) => {
    this.service.deleteMeeting(id).subscribe(() => this.getMeetings());
  }

  editMeeting(index: number) {
    this.isUpdating = true;
    this.registerForm.patchValue(this.meetings[index]);
    this.isUpdating = true;
    this.selectedIndex = index;
  }

  onSubmit() {
    this.submitted = true;
    console.log(this.registerForm.value);
    if (!this.registerForm.valid)
      return;
    if (!this.isUpdating) {
      this.addMeeting(this.registerForm.value);
      this.successMessage = "A new meeting has been successfully scheduled with the client!"
    } else {
      this.updateMeeting(this.registerForm.value, this.meetings[this.selectedIndex].id);
      this.isUpdating = false;
      this.selectedIndex = -1;
      this.successMessage = "The meeting has been successfully updated with the client!"
    }

    this.registerForm.reset();
    this.submitted = false;
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.successMessage = "";
    }, 6000)
  }

  deleteMeetingConfirm(id: number) {
    if (confirm("Are you sure you want to delete this schedule meeting?")) {
      this.deleteMeeting(id);
    }
  }

  resetForm() {
    this.registerForm.reset();
    this.isUpdating = false;
  }

  closeSuccessAlert() {
    this.showSuccessAlert = false;
  }

}
