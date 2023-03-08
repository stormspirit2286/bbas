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
  LIST_DON_VI_TINH = ['Cái', 'Chiếc', 'Bao'];
  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit() {
    this.companyForm = this.fb.group({
      tenCongTy: ['', Validators.required],
      maKhachHang: ['', Validators.required],
      diaChiCongTy: ['', Validators.required],
      diaChiGiaoHang: ['', Validators.required],
      sanPhamDiKem: this.fb.array([
        this.fb.group({
          maSanPham: ['', Validators.required],
          tenSanPham: ['', Validators.required],
          chiTietKyThuat: ['', Validators.required],
          donViTinh: ['', Validators.required],
        }),
      ]),
    });
    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];
  }

  prepareData() {}

  // get diaChiGiaoHang() {
  //   return this.companyForm.controls['diaChiGiaoHang'] as FormArray;
  // }

  get sanPhamDiKem() {
    return this.companyForm.controls['sanPhamDiKem'] as FormArray;
  }

  addNewCompany() {
    this.isShowListCompany = false;
  }

  // addNewMoreAddress() {
  //   this.diaChiGiaoHang.push(
  //     this.fb.group({
  //       address: ['', Validators.required],
  //     })
  //   );
  // }

  addNewMoreProduct() {
    this.sanPhamDiKem.push(
      this.fb.group({
        maSanPham: ['', Validators.required],
        tenSanPham: ['', Validators.required],
        chiTietKyThuat: ['', Validators.required],
        donViTinh: ['', Validators.required],
      })
    );
  }

  removeThisAddress(): void {
    // if (i === 0) return;
    // this.diaChiGiaoHang.removeAt(i);
  }

  removeProduct(i: number) {
    if (i === 0) return;
    this.sanPhamDiKem.removeAt(i);
  }

  submitForm() {
    if (this.companyForm.invalid) return;
    this.listCurrentCompany.push({
      ...this.companyForm.value,
      id: this.listCurrentCompany.length + 1,
    });
    localStorage.setItem(
      'DanhSachCongTy',
      JSON.stringify(this.listCurrentCompany)
    );
    this.companyForm.reset();
    this.toastr.success('Tạo mới thành công !!!');
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
    console.log('data', data);
    this.currentCompany = data;
    this.companyForm.patchValue({
      tenCongTy: data.tenCongTy,
      maKhachHang: data.maKhachHang,
      diaChiCongTy: data.diaChiCongTy,
      diaChiGiaoHang: this.fb.array([
        this.fb.group({
          address: '',
        }),
      ]),
      sanPhamDiKem: this.fb.array([
        this.fb.group({
          maSanPham: ['', Validators.required],
          tenSanPham: ['', Validators.required],
          chiTietKyThuat: ['', Validators.required],
          donViTinh: ['', Validators.required],
        }),
      ]),
    });
    this.isCreateNewCompany = false;
    this.isShowListCompany = false;
  }
}
