import { CommonModule, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ToastService } from '../../services/toast.service';
import { SaveuserService } from '../../services/saveuser.service';

@Component({
    selector: 'app-change-password',
    imports: [ReactiveFormsModule, CommonModule, NgIf],
    templateUrl: './change-password.component.html',
    styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {

    constructor(private route: Router, private userService: UserService, private toast: ToastService, private saveUser: SaveuserService) { }
    user: any
    ngOnInit() {
        this.user = this.saveUser.getUser()
        if (this.user.bool == true) {
            this.openConfirm(
                'You have to change your password due to security reasons!!',
                
                () => {
                    
                }
            );
        }
    }

    changePasswordForm = new FormGroup({
        oldPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
        newPass: new FormControl('', [Validators.required, Validators.minLength(6)]),
        confirmNewPass: new FormControl('', [Validators.required, Validators.minLength(6)])
    })

    get oldPass() {
        return this.changePasswordForm.get('oldPass')
    }

    get newPass() {
        return this.changePasswordForm.get('newPass')
    }

    get confirmNewPass() {
        return this.changePasswordForm.get('confirmNewPass')
    }
    onSubmit() {
        // console.log(this.user.id)

        this.userService.changepassword(this.user.id, this.changePasswordForm.value).subscribe({
            next: () => {
                this.route.navigate(['/home'])
            },
            error: (e) => {
                this.toast.show(e.error.message, 'error')
            }
        })
    }


    showConfirm = false;
    title = '';
    private confirmCallback: () => void = () => { };

    openConfirm(title: string, callback: () => void) {
        this.title = title;
        this.confirmCallback = callback;
        this.showConfirm = true;
    }

    onConfirm() {
        this.confirmCallback();
        this.saveUser.setBool()
        this.user.bool = false
        localStorage.setItem('user',JSON.stringify(this.user))
        this.showConfirm = false;
    }

    onCancel() {
        this.showConfirm = false;
        this.saveUser.clearUser()
        this.route.navigate(['/login'])
    }

}
