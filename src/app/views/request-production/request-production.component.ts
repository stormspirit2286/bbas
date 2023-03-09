import { ToastrService } from 'ngx-toastr';
import { KhachHang, SanPham } from './../models/khachKhang';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as fs from 'file-saver';

import * as Excel from 'exceljs';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';

@Component({
  selector: 'app-request-production',
  templateUrl: './request-production.component.html',
  styleUrls: ['./request-production.component.scss'],
})
export class RequestProductionComponent implements OnInit {
  createProductForm!: FormGroup;
  currentKhachHang?: KhachHang;
  listCurrentCompany: KhachHang[] = [];
  listProducts: SanPham[] = [];
  listProductsByCompany: SanPham[] = [];
  listProductsSelected: SanPham[] = [];

  constructor(private fb: FormBuilder, private toastr: ToastrService) {}

  ngOnInit() {
    this.createProductForm = this.fb.group({
      maKhachHang: ['', Validators.required],
      ngayYeuCau: [new Date(), Validators.required],
      soDonHang: ['', Validators.required],
      diaChiGiaoHang: ['', Validators.required],
    });

    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];
    this.listProducts =
      JSON.parse(localStorage.getItem('DanhSachSanPham') || '[]') || [];

    this.createProductForm
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
        console.log(this.currentKhachHang);

        this.listProductsByCompany = this.listProducts.filter(
          (item) => item.maKhachHang === data
        );
      });
  }

  exportExcel() {
    const prepareDate = {
      soDonHang: this.createProductForm.value.soDonHang,
      maKhachHang: this.createProductForm.value.maKhachHang,
      tenKhachHang: this.currentKhachHang?.tenCongTy,
      diaChiKhachHang: this.currentKhachHang?.diaChiCongTy,
      diaChiGiaoHang: this.currentKhachHang?.diaChiGiaoHang,
      dsSanPham: [],
    };
  }

  // exportExcel() {
  //   // Tạo một workbook mới
  //   const workbook = new Excel.Workbook();

  //   // Tạo một worksheet mới
  //   const worksheet = workbook.addWorksheet('Sheet1');

  //   // Thêm logo vào header bên trái
  //   const logo = workbook.addImage({
  //     filename: 'assets/images/angular.jpg',
  //     extension: 'png',
  //   });
  //   worksheet.addImage(logo, {
  //     // tl: { col: 1, row: 1 },
  //     // br: { col: 2, row: 2 },
  //     tl: new Excel.Anchor({ col: 1, row: 1 }),
  //     br: new Excel.Anchor({ col: 2, row: 2 }),
  //     editAs: 'absolute',
  //   });

  //   // Thêm tiêu đề ở giữa
  //   worksheet.mergeCells('C1:F1');
  //   worksheet.getCell('C1').value = 'Tiêu đề file';

  //   // Thêm thông tin mã số, ngày ban hành, lần ban hành, số trang ở bên phải
  //   worksheet.getCell('H1').value = 'Mã số:';
  //   worksheet.getCell('I1').value = 'MS123';
  //   worksheet.getCell('H2').value = 'Ngày ban hành:';
  //   worksheet.getCell('I2').value = '01/01/2023';
  //   worksheet.getCell('H3').value = 'Lần ban hành:';
  //   worksheet.getCell('I3').value = '1';
  //   worksheet.getCell('H4').value = 'Số trang:';
  //   worksheet.getCell('I4').value = '1';

  //   // Thêm các thông tin trong phần thân file excel
  //   worksheet.getCell('A6').value = 'STT';
  //   worksheet.getCell('B6').value = 'Mã sản phẩm';
  //   worksheet.getCell('C6').value = 'Tên sản phẩm';
  //   worksheet.getCell('D6').value = 'Chi tiết';
  //   worksheet.getCell('E6').value = 'Đơn vị tính';
  //   worksheet.getCell('F6').value = 'Số lượng';
  //   worksheet.getCell('G6').value = 'Ghi chú';

  //   // Thêm dữ liệu vào các ô tương ứng
  //   worksheet.addRow([
  //     1,
  //     'SP001',
  //     'Sản phẩm 1',
  //     'Chi tiết 1',
  //     'Cái',
  //     10,
  //     'Ghi chú 1',
  //   ]);
  //   worksheet.addRow([
  //     2,
  //     'SP002',
  //     'Sản phẩm 2',
  //     'Chi tiết 2',
  //     'Cái',
  //     5,
  //     'Ghi chú 2',
  //   ]);
  //   worksheet.addRow([
  //     3,
  //     'SP003',
  //     'Sản phẩm 3',
  //     'Chi tiết 3',
  //     'Cái',
  //     3,
  //     'Ghi chú 3',
  //   ]);

  //   // Xuất file Excel
  //   const fileName = 'my-excel-file.xlsx';
  //   workbook.xlsx.writeBuffer().then((buffer: ArrayBuffer) => {
  //     const blob = new Blob([buffer], {
  //       type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  //     });
  //     fs.saveAs(blob, fileName);
  //   });
  // }

  resetForm() {
    this.createProductForm.reset();
    this.createProductForm.patchValue({
      maCty: '',
    });
  }
}
