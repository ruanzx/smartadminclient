import { Component, OnInit, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { TaxTrackingService } from '../services/taxTracking.service';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';

@Component({
    selector: 'tax-reports',
    providers: [TaxTrackingService],
    styleUrls: ['./tax.component.css'],
    templateUrl: './taxReports.component.html'
})
export class TaxReportsComponent implements OnInit {

    taxCurrentReports = [];    
    reportDate = new Date();       
    modalMessage :string = '';
    modalReportType:string = '';
    modalClientCode:string = '';

    @ViewChild('modal') modal: ModalComponent;

    constructor(private taxTrackingService: TaxTrackingService,
                private route: ActivatedRoute,
                private router: Router) {        
    }

    ngOnInit() {
        this.taxTrackingService.getCurrentReports()
            .subscribe(x => this.taxCurrentReports = x);
    }

    btnViewTaxReport(clientCode:string) {    
        this.router.navigateByUrl('/tax/taxReport/' + clientCode);
    }

    btnViewDistributionReport(clientCode:string) {   
        this.router.navigateByUrl('/tax/distReport/' + clientCode);    
    }

    btnSendTaxReport(clientCode:string, idx: number) {    
        this.modalClientCode = clientCode;
        this.modalReportType = 'tax';

        let rpt = this.taxCurrentReports[idx];
        if (rpt.TaxReportSent) {
            this.modalMessage = 'The tax report has been sent previously, do you want to send it again?';
            this.modal.open();
        } else {
            this.router.navigateByUrl('/tax/taxEmail/tax/' + clientCode);
        }
    }

    btnSendDistributionReport(clientCode:string, idx: number) {   
        this.modalClientCode = clientCode;
        this.modalReportType = 'dist';
        
        let rpt = this.taxCurrentReports[idx];
        if (rpt.DistributionReportSent) {
            this.modalMessage = 'The tax report has been sent previously, do you want to send it again?';
            this.modal.open();
        } else {
            this.router.navigateByUrl('/tax/taxEmail/dist/' + clientCode);
        }
    }

    btnSendBothReport(clientCode:string, idx: number) {   
        this.modalClientCode = clientCode;
        this.modalReportType = 'both';
        
        let rpt = this.taxCurrentReports[idx];

        if (rpt.DistributionReportSent && rpt.TaxReportSent) {
            this.modalMessage = 'Both of the distribution report has been sent previously, do you want to send it again?';            
            this.modal.open();
        }
        else if (rpt.DistributionReportSent) {
            this.modalMessage = 'The distribution report has been sent previously, do you want to send it again?';
            this.modal.open();
        }
        else if (rpt.TaxReportSent) {
            this.modalMessage = 'The tax report has been sent previously, do you want to send it again?';
            this.modal.open().then(x=> {
                this.router.navigateByUrl('/tax/taxEmail/both/' + clientCode)
            });
        } else {
            this.router.navigateByUrl('/tax/taxEmail/both/' + clientCode)
        }        
    }

    btnReportLog() {
        this.router.navigateByUrl('/tax/reportlog');    
    }

    onClose() {    
        console.log('modal close event');
        this.router.navigateByUrl('/tax/taxEmail/' + this.modalReportType + '/' + this.modalClientCode);
    }

}