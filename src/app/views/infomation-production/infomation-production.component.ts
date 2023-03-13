import { ToastrService } from 'ngx-toastr';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KhachHang, SanPham } from '../models/khachKhang';
import { LIST_DON_VI_TINH } from '../models/khachKhang';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
// import { CurrencyFormattingDirective } from '../directive/currentcy-formatting.directive';

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
  currentKhachHang?: KhachHang;
  listCurrentCompany: KhachHang[] = [];
  listCurrentProduct: SanPham[] = [];
  listCurrentProductByCompany: SanPham[] = [];
  listProducts: SanPham[] = [];
  currentProductId = '';
  LIST_DON_VI_TINH = LIST_DON_VI_TINH;
  listProductsByCompany: SanPham[] = [];
  listDiaChiGiaoHang?: { address: string }[] = [];

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
      giaSanPham: ['', Validators.required],
      danhSachSanPham: this.fb.array([]),
    });
    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];

    this.listProducts =
      JSON.parse(localStorage.getItem('DanhSachSanPham') || '[]') || [];
    this.addNewProductForm
      .get('maKhachHang')
      ?.valueChanges.pipe(
        debounceTime(100), // giới hạn thời gian giữa các lần gửi yêu cầu
        distinctUntilChanged(), // chỉ gửi yêu cầu nếu giá trị khác so với lần gửi trước đó
        switchMap((value) => {
          return of(value);
        })
      )
      .subscribe((data) => {
        this.currentKhachHang = this.listCurrentCompany.find(
          (item) => item.maKhachHang === data
        );
        this.listProductsByCompany = this.listProducts.filter(
          (item) => item.maKhachHang === data
        );
        this.listDiaChiGiaoHang = [];
        this.listDiaChiGiaoHang = this.currentKhachHang?.diaChiGiaoHang;
        this.addDanhSachDH();
      });
  }

  get danhSachSanPham(): FormArray {
    return this.addNewProductForm.get('danhSachSanPham') as FormArray;
  }

  addDanhSachDH(): void {
    this.listProductsByCompany.forEach((item) => {
      this.danhSachSanPham.push(
        this.fb.group({
          isChecked: [false],
          soLuong: [{ value: '', disabled: true }, Validators.required],
          ngayCanGiaoHang: [{ value: '', disabled: true }, Validators.required],
          ghiChu: [{ value: '', disabled: true }],
          tenSanPham: item.tenSanPham,
          maSanPham: item.maSanPham,
          donViTinh: item.donViTinh,
          chiTietKyThuat: item.chiTietKyThuat,
        })
      );
    });
  }

  addMore() {
    this.isShowList = false;
    this.isCreateNewProduct = true;
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
    const index2 = this.listCurrentProductByCompany.findIndex(
      (item) => item.id === this.currentProductId
    );
    if (index === -1 || index2 === -1) return;
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
      giaSanPham: data?.giaSanPham,
    });
  }

  searchProductByCompany() {
    this.listCurrentProduct = JSON.parse(
      localStorage.getItem('DanhSachSanPham') || '[]'
    );
    this.listCurrentProductByCompany = this.listCurrentProduct.filter(
      (item) => item.maKhachHang === this.companyForm.value.maKhachHang
    );
  }

  submitProductForm() {
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
      const index2 = this.listCurrentProductByCompany.findIndex(
        (item) => item.id === this.currentProductId
      );
      if (index === -1 || index2 === -1) return;
      this.listCurrentProductByCompany.splice(index2, 1);
      this.listCurrentProduct.splice(index, 1);
      this.listCurrentProductByCompany.push(data);
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
      this.toastr.success('Cập nhật SP thành công !!!');
    }
  }

  resetForm() {
    this.addNewProductForm.reset();
    this.addNewProductForm.patchValue({
      donViTinh: '',
    });
    this.isCreateNewProduct = false;
  }

  backToList() {
    this.isShowList = true;
    this.addNewProductForm.reset();
    this.resetForm();
    this.searchProductByCompany();
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
