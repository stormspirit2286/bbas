import { KhachHang } from './../models/khachKhang';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { freeSet } from '@coreui/icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-infomation-company',
  templateUrl: './infomation-company.component.html',
  styleUrls: ['./infomation-company.component.scss'],
})
export class InfomationCompanyComponent implements OnInit {
  visible = false;
  icons = freeSet;
  companyForm!: FormGroup;
  isShowListCompany = true;
  isCreateNewCompany = true;
  currentCompanyId = -1;
  currentCompany?: KhachHang;
  listCurrentCompany: KhachHang[] = [];
  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit() {
    this.companyForm = this.fb.group({
      tenCongTy: ['', Validators.required],
      maKhachHang: ['', Validators.required],
      diaChiCongTy: ['', Validators.required],
      diaChiGiaoHang: this.fb.array([
        this.fb.group({
          address: ['', Validators.required],
        }),
      ]),
    });
    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];
  }

  prepareData() {}

  get diaChiGiaoHang() {
    return this.companyForm.controls['diaChiGiaoHang'] as FormArray;
  }

  addNewCompany() {
    this.isShowListCompany = false;
  }

  addNewMoreAddress() {
    this.diaChiGiaoHang.push(
      this.fb.group({
        address: ['', Validators.required],
      })
    );
  }

  removeThisAddress(i: number): void {
    if (i === 0) return;
    this.diaChiGiaoHang.removeAt(i);
  }

  submitForm() {
    if (this.companyForm.invalid) return;
    const data = { ...this.companyForm.value };
    let tempCompany;
    if (this.isCreateNewCompany) {
      tempCompany = {
        ...data,
        id: this.listCurrentCompany.length + 1,
      };
      this.listCurrentCompany.push(tempCompany);
      this.toastr.success('Tạo mới thành công !!!');
    } else {
      const index = this.listCurrentCompany.findIndex(
        (item) => item.id === this.currentCompany?.id
      );
      if (index === -1) return;
      tempCompany = {
        ...data,
        id: this.currentCompany?.id,
      };
      this.listCurrentCompany.splice(index, 1, tempCompany);
      this.toastr.success('Cập nhật thành công !!!');
    }
    localStorage.setItem(
      'DanhSachCongTy',
      JSON.stringify(this.listCurrentCompany)
    );
    this.companyForm.reset();
  }

  resetForm() {
    this.companyForm.reset();
  }

  backToList() {
    this.isShowListCompany = true;
  }

  deleteCompany(id: number) {
    this.currentCompanyId = id;
    this.visible = !this.visible;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  confirmDelete() {
    const index = this.listCurrentCompany.findIndex(
      (item) => item.id === this.currentCompanyId
    );
    if (index === -1) return;
    this.listCurrentCompany.splice(index, 1);

    localStorage.setItem(
      'DanhSachCongTy',
      JSON.stringify(this.listCurrentCompany)
    );
    this.toastr.success('Xoá thành công !!!');

    this.visible = false;
  }

  showCurrentCompany(data: KhachHang) {
    this.currentCompany = data;
    this.companyForm.patchValue({
      tenCongTy: data.tenCongTy,
      maKhachHang: data.maKhachHang,
      diaChiCongTy: data.diaChiCongTy,
      diaChiGiaoHang: data.diaChiGiaoHang,
    });
    this.isCreateNewCompany = false;
    this.isShowListCompany = false;
  }
}
