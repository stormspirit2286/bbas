import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KhachHang, SanPham } from '../models/khachKhang';

@Component({
  selector: 'app-infomation-production',
  templateUrl: './infomation-production.component.html',
  styleUrls: ['./infomation-production.component.scss'],
})
export class InfomationProductionComponent implements OnInit {
  visible = false;
  isShowList = true;
  isCreateNewProduct = true;
  companyForm!: FormGroup;
  addNewProductForm!: FormGroup;
  listCurrentCompany: KhachHang[] = [];
  listCurrentProduct: SanPham[] = [];
  listCurrentProductByCompany: SanPham[] = [];
  currentProductId = '';
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

  deleteProduct(id: string) {
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
    const index = this.listCurrentProduct.findIndex(
      (item) => item.id === this.currentProductId
    );
    if (index === -1) return;
    const index2 = this.listCurrentProductByCompany.findIndex(
      (item) => item.id === this.currentProductId
    );
    if (index2 === -1) return;
    this.listCurrentProductByCompany.splice(index2, 1);
    this.listCurrentProduct.splice(index, 1);

    localStorage.setItem(
      'DanhSachSanPham',
      JSON.stringify(this.listCurrentProduct)
    );
    this.toastr.success('Xoá thành công !!!');
    this.visible = false;
  }

  showCurrentProduct(data: SanPham) {
    this.currentProductId = data.id;
    this.isShowList = false;
    this.isCreateNewProduct = false;
    this.addNewProductForm.patchValue({
      maKhachHang: data.maKhachHang,
      maSanPham: data.maSanPham,
      tenSanPham: data.tenSanPham,
      chiTietKyThuat: data.chiTietKyThuat,
      donViTinh: data.donViTinh,
    });
  }

  searchProductByCompany() {
    this.listCurrentProduct = JSON.parse(
      localStorage.getItem('DanhSachSanPham') || '[]'
    );
    console.log(this.companyForm.value);

    this.listCurrentProductByCompany = this.listCurrentProduct.filter(
      (item) => item.maKhachHang === this.companyForm.value.maKhachHang
    );

    console.log('listProduct', this.listCurrentProductByCompany);
  }

  createProduct() {
    console.log(this.isCreateNewProduct);

    if (this.isCreateNewProduct) {
      const data = { ...this.addNewProductForm.value, id: this.generateId() };
      this.listCurrentProduct.push(data);
      localStorage.removeItem('DanhSachSanPham');
      localStorage.setItem(
        'DanhSachSanPham',
        JSON.stringify(this.listCurrentProduct)
      );
      this.addNewProductForm.reset();
      this.addNewProductForm.patchValue({
        donViTinh: '',
      });
      this.toastr.success('Tạo mới SP thành công !!!');
    } else {
      const data = {
        id: this.currentProductId,
        ...this.addNewProductForm.value,
      };
      const index = this.listCurrentProduct.findIndex(
        (item) => item.id === this.currentProductId
      );
      if (index === -1) return;
      const index2 = this.listCurrentProductByCompany.findIndex(
        (item) => item.id === this.currentProductId
      );
      if (index2 === -1) return;
      this.listCurrentProductByCompany.splice(index2, 1);
      this.listCurrentProduct.splice(index, 1);
      this.listCurrentProductByCompany.push(data);
      this.listCurrentProduct.push(data);
      localStorage.setItem(
        'DanhSachSanPham',
        JSON.stringify(this.listCurrentProduct)
      );
      this.addNewProductForm.reset();
      this.addNewProductForm.patchValue({
        donViTinh: '',
      });
      this.toastr.success('Cập nhật SP thành công !!!');
    }

    // console.log('value', this.addNewProductForm.value);
  }

  resetForm() {
    this.addNewProductForm.reset();
    this.isCreateNewProduct = false;
  }

  backToList() {
    this.isShowList = true;
  }

  generateId() {
    let result = '';
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }
}