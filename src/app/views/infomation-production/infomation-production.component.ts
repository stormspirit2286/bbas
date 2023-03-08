import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KhachHang } from '../models/khachKhang';

@Component({
  selector: 'app-infomation-production',
  templateUrl: './infomation-production.component.html',
  styleUrls: ['./infomation-production.component.scss'],
})
export class InfomationProductionComponent implements OnInit {
  visible = false;
  isShowList = true;
  companyForm!: FormGroup;
  addNewProductForm!: FormGroup;
  listCurrentCompany: KhachHang[] = [];
  currentProductId?: number;
  LIST_DON_VI_TINH = ['Cái', 'Chiếc', 'Bao'];
  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.companyForm = this.fb.group({
      maKhachHang: ['', Validators.required],
    });

    this.addNewProductForm = this.fb.group({
      maKhachHang: [''],
      maSanPham: ['', Validators.required],
      tenSanPham: ['', Validators.required],
      chiTietKyThuat: ['', Validators.required],
      donViTinh: ['', Validators.required],
    });
    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];
    console.log(this.listCurrentCompany);
  }

  addMore() {
    this.isShowList = false;
  }

  deleteProduct(id: number) {
    this.currentProductId = id;
    this.visible = !this.visible;
  }

  toggleLiveDemo() {
    this.visible = !this.visible;
  }

  handleLiveDemoChange(event: any) {
    this.visible = event;
  }

  confirmDelete() {
    this.toastr.success('Xoá thành công !!!');
    this.visible = false;
  }

  showCurrentProduct() {}

  submitForm() {}

  addNewProduct() {}

  resetForm() {
    this.addNewProductForm.reset();
  }

  backToList() {
    this.isShowList = true;
  }
}
