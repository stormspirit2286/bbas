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
      tenThuongGoi: ['', Validators.required],
      gioiTinhViDaiDien: [''],
      hoTenViDaiDien: [''],
      chucVu: [''],
      dienThoai: [''],
      diaChiGiaoHang: this.fb.array([
        this.fb.group({
          address: ['', Validators.required],
        }),
      ]),
    });
    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];
  }

  get diaChiGiaoHang() {
    return this.companyForm.controls['diaChiGiaoHang'] as FormArray;
  }

  addNewCompany() {
    this.isShowListCompany = false;
    this.isCreateNewCompany = true;
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
    const { chucVu, hoTenViDaiDien, gioiTinhViDaiDien, ...data } =
      this.companyForm.value;
    const daiDienCongTy = {
      hoTenViDaiDien,
      chucVu,
      gioiTinhViDaiDien,
    };
    // const tempCompany = this.isCreateNewCompany
    //   ? { ...data, daiDienCongTy, id: this.listCurrentCompany.length + 1 }
    //   : { ...data, daiDienCongTy, id: this.currentCompany?.id };

    // const index = this.listCurrentCompany.findIndex(
    //   (item) => item.id === tempCompany.id
    // );
    // if (index === -1) {
    //   // create a new company
    //   this.listCurrentCompany.push(tempCompany);
    // } else {
    //   // replace that company
    //   this.listCurrentCompany.splice(index, 1, tempCompany);
    // }

    // localStorage.setItem(
    //   'DanhSachCongTy',
    //   JSON.stringify(this.listCurrentCompany)
    // );
    // this.toastr.success(
    //   this.isCreateNewCompany
    //     ? 'Tạo mới thành công !!!'
    //     : 'Cập nhật thành công !!!'
    // );
    // this.companyForm.reset();

    let tempCompany;
    if (this.isCreateNewCompany) {
      tempCompany = {
        ...data,
        daiDienCongTy,
        id: this.listCurrentCompany.length + 1,
      };
      this.listCurrentCompany.push(tempCompany);
    } else {
      const index = this.listCurrentCompany.findIndex(
        (item) => item.id === this.currentCompany?.id
      );
      if (index === -1) return;
      tempCompany = {
        ...data,
        daiDienCongTy,
        id: this.currentCompany?.id,
      };
      this.listCurrentCompany.splice(index, 1, tempCompany);
    }
    localStorage.setItem(
      'DanhSachCongTy',
      JSON.stringify(this.listCurrentCompany)
    );
    this.toastr.success(
      this.isCreateNewCompany
        ? 'Tạo mới thành công !!!'
        : 'Cập nhật thành công !!!'
    );
    this.companyForm.reset();
  }

  resetForm() {
    this.companyForm.reset();
    this.companyForm.patchValue({
      chucVu: '',
      gioiTinhViDaiDien: '',
    });
  }

  backToList() {
    this.isShowListCompany = true;
    this.resetForm();
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
    const { daiDienCongTy, ...formData } = data;
    const { gioiTinhViDaiDien, hoTenViDaiDien, chucVu } = daiDienCongTy || {};
    this.currentCompany = data;
    this.companyForm.patchValue({
      ...formData,
      gioiTinhViDaiDien: gioiTinhViDaiDien || '',
      hoTenViDaiDien: hoTenViDaiDien || '',
      chucVu: chucVu || '',
    });
    this.isCreateNewCompany = false;
    this.isShowListCompany = false;
  }
}
