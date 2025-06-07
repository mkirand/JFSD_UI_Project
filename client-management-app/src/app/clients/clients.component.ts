import { Component, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';
import { DataService } from '../data.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const passwordControl = control.get('password');
    const confirmPasswordControl = control.get('repeatPassword');

    if (!passwordControl || !confirmPasswordControl) {
      return null; // One of the controls doesn't exist
    }

    if (passwordControl.value === confirmPasswordControl.value) {
      return null; // Passwords match
    } else {
      return { passwordMismatch: true }; // Passwords don't match
    }
  };
}
@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.css']
})
export class ClientsComponent {
  @ViewChild('modal') modal!: TemplateRef<any>;
  modalRef?: BsModalRef;
  registerForm: FormGroup; //If you get error for this line add strictPropertyInitialization: false in tsconfig.json.
  submitted: boolean = false;
  clients: any = [];
  isUpdating: boolean = false;
  selectedIndex: number = -1;
  showSuccessAlert: boolean = false;
  successMessage: string = "";


  constructor(private builder: FormBuilder, private service: DataService, private modalService: BsModalService) { }

  ngOnInit() {
    this.getClients();
    this.registerForm = this.builder.group({
      fullname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      repeatPassword: ['', [Validators.required]]
    }, { validators: passwordMatchValidator() });
  }

  get form() {
    return this.registerForm.controls;
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template, { class: 'modal-dialog-centered' });
  }

  closeModal() {
    this.modalRef?.hide();
    this.registerForm.reset();
    this.submitted = false;
    this.isUpdating = false;
    this.selectedIndex = -1;
  }

  getClients = () => {
    this.service.getClients().subscribe(results => { this.clients = results });
  }

  addClient = (client: any) => {
    this.service.addClient(client).subscribe(() => this.getClients());
  }

  updateClient = (client: any, clientID: number) => {
    this.service.updateClient(client, clientID).subscribe(() => this.getClients());
  }

  deleteClient = (id: number) => {
    this.service.deleteClient(id).subscribe(() => this.getClients());
  }

  editClient(index: number) {
    this.isUpdating = true;
    this.registerForm.patchValue(this.clients[index]);
    this.isUpdating = true;
    this.selectedIndex = index;
    this.openModal(this.modal);
  }

  onSubmit() {
    this.submitted = true;
    if (!this.registerForm.valid)
      return;
    if (!this.isUpdating) {
      this.addClient(this.registerForm.value);
      this.successMessage = "A new client has been successfully added!"
    } else {
      this.updateClient(this.registerForm.value, this.clients[this.selectedIndex].id);
      this.successMessage = "Client details has been successfully updated!"
    }
    this.closeModal();
    this.showSuccessAlert = true;
    setTimeout(() => {
      this.showSuccessAlert = false;
      this.successMessage = "";
    }, 6000)
  }

  resetForm() {
    this.modalRef?.hide();
    this.registerForm.reset()
    this.isUpdating = false;

  }

  deleteClientConfirm(id: number) {
    if (confirm("Are you sure you want to delete this client?")) {
      this.deleteClient(id);
    }
  }

  closeSuccessAlert() {
    this.showSuccessAlert = false;
  }
}
