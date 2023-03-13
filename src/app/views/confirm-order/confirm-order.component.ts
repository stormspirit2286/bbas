import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  HINH_THUC_THANH_TOAN,
  KhachHang,
  SanPham,
  THOI_GIAN_GIAO_HANG,
} from '../models/khachKhang';
import { freeSet } from '@coreui/icons';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-confirm-order',
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.scss'],
})
export class ConfirmOrderComponent implements OnInit {
  @ViewChild('fondovalor') fondovalor!: ElementRef;
  idAddMoreAddress = false;
  icons = freeSet;
  orderForm!: FormGroup;
  listCurrentCompany: KhachHang[] = [];
  currentKhachHang?: KhachHang;
  listProductsByCompany: SanPham[] = [];
  listProducts: SanPham[] = [];
  listDiaChiGiaoHang?: { address: string }[] = [];
  listThoiGianGiaoHang = THOI_GIAN_GIAO_HANG;
  listHinhThucThanhToan = HINH_THUC_THANH_TOAN;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.orderForm = this.fb.group({
      maKhachHang: ['', Validators.required],
      ngayYeuCau: ['', Validators.required],
      diaChiGiaoHang: ['', Validators.required],
      thoiGianGiaoHang: ['', Validators.required],
      hinhThucThanhToan: ['', Validators.required],
      danhSachSanPham: this.fb.array([]),
    });

    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];
    this.listProducts =
      JSON.parse(localStorage.getItem('DanhSachSanPham') || '[]') || [];

    this.orderForm
      .get('maKhachHang')
      ?.valueChanges.pipe(
        debounceTime(100), // giới hạn thời gian giữa các lần gửi yêu cầu
        distinctUntilChanged(), // chỉ gửi yêu cầu nếu giá trị khác so với lần gửi trước đó
        switchMap((value) => {
          return of(value);
        })
      )
      .subscribe((data) => {
        console.log(data);

        this.currentKhachHang = this.listCurrentCompany.find(
          (item) => item.maKhachHang === data
        );
        this.listProductsByCompany = this.listProducts.filter(
          (item) => item.maKhachHang === data
        );
        console.log(' this.listProductsByCompany', this.listProductsByCompany);

        this.listDiaChiGiaoHang = [];
        this.listDiaChiGiaoHang = this.currentKhachHang?.diaChiGiaoHang;
        this.addDanhSachDH();
      });
  }

  get danhSachSanPham(): FormArray {
    return this.orderForm.get('danhSachSanPham') as FormArray;
  }

  addDanhSachDH(): void {
    this.listProductsByCompany.forEach((item: any) => {
      this.danhSachSanPham.push(
        this.fb.group({
          isChecked: [false],
          soLuong: [{ value: '', disabled: true }, Validators.required],
          tenSanPham: item.tenSanPham,
          maSanPham: item.maSanPham,
          donViTinh: item.donViTinh,
          chiTietKyThuat: item.chiTietKyThuat,
          giaSanPham: item.giaSanPham,
        })
      );
    });
  }

  resetForm() {
    this.orderForm.reset();
  }

  exportExcel() {
    console.log(this.orderForm.value);
  }

  addMoreAddress() {
    this.idAddMoreAddress = !this.idAddMoreAddress;
  }

  handleChange(event: any, data: any) {
    const { soLuong } = data.controls;
    event.target.checked
      ? [soLuong].forEach((control) => control.enable())
      : [soLuong].forEach((control) => control.disable());
  }

  onSaveAddress() {
    const valueInput = this.fondovalor.nativeElement.value;
    let tempCompany: KhachHang;
    if (this.currentKhachHang) {
      const index = this.listCurrentCompany.findIndex(
        (item) => item.id === this.currentKhachHang?.id
      );
      if (index === -1) return;
      const listDC: { address: string }[] =
        this.currentKhachHang.diaChiGiaoHang;
      listDC.push({ address: valueInput });
      tempCompany = {
        ...this.currentKhachHang,
        diaChiGiaoHang: listDC,
      };
      console.log(tempCompany);

      this.listCurrentCompany.splice(index, 1, tempCompany);
      localStorage.setItem(
        'DanhSachCongTy',
        JSON.stringify(this.listCurrentCompany)
      );
      this.toastr.success('Cập nhật thành công !!!');
    } else {
      this.toastr.warning('Cập nhật thất bại !!!');
    }
    this.idAddMoreAddress = !this.idAddMoreAddress;
  }
}
