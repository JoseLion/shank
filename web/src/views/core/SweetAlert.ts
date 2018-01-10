import { Injectable } from '@angular/core';
import { consts } from './consts';
import swal from 'sweetalert2';
import { MessageService } from 'primeng/components/common/messageservice';

@Injectable()
export class SweetAlert {

    static save(onAccept? : any, onCancel? : any) {
        swal({
            title: 'Are you sure?',
            text: 'You will save the information',
            type: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes!',
            cancelButtonText: 'No!',
            showLoaderOnConfirm: true
        }).then(result => {
            if(result.value) {
                if(onAccept != null) {
                    onAccept();
                } else {
                    this.close();
                }
            } else {
                if(onCancel != null) {
                    onCancel();
                } else {
                    this.close();
                }
            }
        });
    }

    static close() {
        swal.close();
    }

    static successNotif(message, messageService) {
        messageService.add({severity: 'success', detail: message});
    }

    static errorNotif(message, messageService) {
        messageService.add({severity: 'error', detail: message});
    }

}
