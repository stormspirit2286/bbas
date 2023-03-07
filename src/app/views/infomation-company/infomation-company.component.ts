import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';

@Component({
  selector: 'app-infomation-company',
  templateUrl: './infomation-company.component.html',
  styleUrls: ['./infomation-company.component.scss'],
})
export class InfomationCompanyComponent implements OnInit {
  icons = freeSet;
  companyForm!: FormGroup;
  isShowListCompany = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.companyForm = this.fb.group({
      nameCompany: ['', Validators.required],
      maKhachHang: ['', Validators.required],
      diaChiCongTy: ['', Validators.required],
      diaChiGiaoHang: this.fb.array([
        this.fb.group({
          label: [''],
          isSelected: [false],
        }),
      ]),
    });
  }

  addNewCompany() {
    this.isShowListCompany = false;
  }

  addNewMoreAddress() {}

  addNewCom() {}

  resetForm() {}
}
