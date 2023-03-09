import { ToastrService } from 'ngx-toastr';
import { imgBase64, KhachHang, SanPham } from './../models/khachKhang';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import * as fs from 'file-saver';

import * as Excel from 'exceljs';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
export interface ROW_ITEM {
  ID: number;
  NAME: string;
  DEPARTMENT: string;
  MONTH: string;
  YEAR: number;
  SALES: number;
  CHANGE: number;
  LEADS: number;
}

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

  title = 'angular-export-to-excel';

  dataForExcel: ROW_ITEM[] = [];

  empPerformance = [
    {
      ID: 10011,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Jan',
      YEAR: 2022,
      SALES: 132412,
      CHANGE: 12,
      LEADS: 35,
    },
    {
      ID: 10012,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Feb',
      YEAR: 2022,
      SALES: 232324,
      CHANGE: 2,
      LEADS: 443,
    },
    {
      ID: 10013,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Mar',
      YEAR: 2022,
      SALES: 542234,
      CHANGE: 45,
      LEADS: 345,
    },
    {
      ID: 10014,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'Apr',
      YEAR: 2022,
      SALES: 223335,
      CHANGE: 32,
      LEADS: 234,
    },
    {
      ID: 10015,
      NAME: 'A',
      DEPARTMENT: 'Sales',
      MONTH: 'May',
      YEAR: 2022,
      SALES: 455535,
      CHANGE: 21,
      LEADS: 12,
    },
  ];

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
    console.log(prepareDate);
  }

  exportToExcel() {
    this.empPerformance.forEach((row) => {
      this.dataForExcel.push(row);
    });

    // let reportData = {
    //   soDonHang: this.createProductForm.value.soDonHang,
    //   maKhachHang: this.createProductForm.value.maKhachHang,
    //   tenKhachHang: this.currentKhachHang?.tenCongTy,
    //   diaChiKhachHang: this.currentKhachHang?.diaChiCongTy,
    //   diaChiGiaoHang: this.currentKhachHang?.diaChiGiaoHang,
    //   title: 'PHIẾU YÊU CẦU SẢN XUẤT',
    //   data: this.dataForExcel,
    //   headers: Object.keys(this.empPerformance[0]),
    // };
    let reportData = {
      soDonHang: 'DH0101010',
      maKhachHang: 'MAKHASHCHANG ABC',
      tenKhachHang: 'Công ty ABC DEF',
      diaChiKhachHang: '360 Giải Phóng',
      diaChiGiaoHang:
        'Đường số 3, Cụm CN Xã Phú Thạnh, Xã Vĩnh Thanh, Huyện Nhơn Trạch, Tỉnh Đồng Nai Ms Nghĩa: 038 625 7686 ',
      title: 'PHIẾU YÊU CẦU SẢN XUẤT',
      data: this.dataForExcel,
      headers: Object.keys(this.empPerformance[0]),
    };

    this.exportExcelHello(reportData);
  }

  exportExcelHello(excelData: any) {
    //Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    //Create a workbook with a worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('BBAS');
    // worksheet.getColumn('A').width = 10;

    //Add Row and formatting
    worksheet.mergeCells('C1', 'E4');
    let titleRow = worksheet.getCell('C1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Times',
      size: 22,
      underline: 'none',
      bold: true,
      color: { argb: 'black' },
    };
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' };

    // Mã số
    worksheet.mergeCells('F1:H1');
    let maSo = worksheet.getCell('F1');
    maSo.value = 'Mã số: KD.01.HD05';
    maSo.font = {
      name: 'Times',
      size: 10,
      bold: true,
    };
    maSo.alignment = { vertical: 'middle', horizontal: 'left' };
    // Ngày ban hành
    worksheet.mergeCells('F2:H2');
    let ngAyBanHanh = worksheet.getCell('F2');
    ngAyBanHanh.value = 'Ngày ban hành: 02/09/2021';
    ngAyBanHanh.font = {
      name: 'Times',
      size: 10,
      bold: true,
    };
    ngAyBanHanh.alignment = { vertical: 'middle', horizontal: 'left' };
    // Lần ban hành
    worksheet.mergeCells('F3:H3');
    let lanBanHanh = worksheet.getCell('F3');
    lanBanHanh.value = 'Lần ban hành: 01';
    lanBanHanh.font = {
      name: 'Times',
      size: 10,
      bold: true,
    };
    lanBanHanh.alignment = { vertical: 'middle', horizontal: 'left' };

    // Số trang
    worksheet.mergeCells('F4:H4');
    let soTrang = worksheet.getCell('F4');
    soTrang.value = 'Số trang: 1/1';
    soTrang.font = {
      name: 'Times',
      size: 10,
      bold: true,
    };
    soTrang.alignment = { vertical: 'middle', horizontal: 'left' };

    // Ngày yêu cầu
    worksheet.mergeCells('A6:H6');
    let ngayYeuCau = worksheet.getCell('A6');
    ngayYeuCau.value = `1. Ngày yêu cầu: ${excelData.soDonHang}`;
    ngayYeuCau.font = {
      name: 'Times',
      size: 11,
      bold: true,
    };
    ngayYeuCau.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A7:H7');
    let KHACHHANG = worksheet.getCell('A7');
    KHACHHANG.value = `2. Khách hàng: ${excelData.tenKhachHang}`;
    KHACHHANG.font = {
      name: 'Times',
      size: 11,
      bold: true,
    };
    KHACHHANG.alignment = { vertical: 'middle', horizontal: 'left' };

    worksheet.mergeCells('A8:H8');
    let diaChiCty = worksheet.getCell('A8');
    diaChiCty.value = `3. Địa chỉ: ${excelData.tenKhachHang}`;
    diaChiCty.font = {
      name: 'Times',
      size: 11,
      bold: true,
    };
    diaChiCty.alignment = { vertical: 'middle', horizontal: 'left' };

    // Mã khách hàng
    worksheet.mergeCells('A9:H9');
    let maKhachHang = worksheet.getCell('A9');
    maKhachHang.value = `4. Mã khách hàng: ${excelData.maKhachHang}`;
    maKhachHang.font = {
      name: 'Times',
      size: 11,
      bold: true,
    };
    maKhachHang.alignment = { vertical: 'middle', horizontal: 'left' };

    // Số đơn hàng
    worksheet.mergeCells('A10:H10');
    let soDonHang = worksheet.getCell('A10');
    soDonHang.value = `5. Số đơn hàng: ${excelData.maKhachHang}`;
    soDonHang.font = {
      name: 'Times',
      size: 11,
      bold: true,
    };
    soDonHang.alignment = { vertical: 'middle', horizontal: 'left' };

    //Add Image
    let myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('A1:B4');
    worksheet.addImage(myLogoImage, 'A1:B4');

    //Blank Row
    worksheet.addRow([]);

    //Adding Header Row
    // let headerRow = worksheet.addRow(header);
    // headerRow.eachCell((cell, number) => {
    //   cell.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: '4167B8' },
    //     bgColor: { argb: '' },
    //   };
    //   cell.font = {
    //     bold: true,
    //     color: { argb: 'FFFFFF' },
    //     size: 12,
    //   };
    // });

    const headers = [
      'STT',
      'Mã sản phẩm',
      'Tên sản phẩm',
      'Chi tiết kỹ thuật',
      'ĐVT',
      'Số lượng',
      'Ngày cần\ngiao hàng',
      'Ghi chú',
    ];
    const headerRowS = worksheet.addRow(headers);
    headerRowS.eachCell((cell, colNumber) => {
      // cell.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: 'CCCCCC' },
      // };
      cell.font = {
        name: 'Times',
        size: 11,
        bold: true,
      };
    });
    const rowHeaderTable = worksheet.getRow(12);
    rowHeaderTable.height = 30;
    rowHeaderTable.font = {
      name: 'Times',
      size: 11,
      bold: true,
    };
    rowHeaderTable.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    const products = [
      {
        STT: 1,
        TenSanPham: 'Sản phẩm A',
        MaSanPham: 'A001',
        ChiTiet: 'Chi tiết sản phẩm A',
        SoLuong: 10,
        GhiChu: '',
      },
      {
        STT: 2,
        TenSanPham: 'Sản phẩm B',
        MaSanPham: 'B001',
        ChiTiet: 'Chi tiết sản phẩm B',
        SoLuong: 20,
        GhiChu: '',
      },
      {
        STT: 3,
        TenSanPham: 'Sản phẩm C',
        MaSanPham: 'C001',
        ChiTiet: 'Chi tiết sản phẩm C',
        SoLuong: 30,
        GhiChu: '',
      },
    ];

    products.forEach((product, index) => {
      const rowData = [
        product.STT,
        product.TenSanPham,
        product.MaSanPham,
        product.ChiTiet,
        product.SoLuong,
        product.GhiChu,
      ];

      worksheet.addRow(rowData);
    });

    // Định dạng lại các cột trong bảng
    worksheet.columns.forEach((column) => {
      column.width = 15;
    });

    // Adding Data with Conditional Formatting
    // data.forEach((d: any) => {
    //   let row = worksheet.addRow(Object.values(d));

    //   let sales = row.getCell(6);
    //   let color = 'FF99FF99';
    //   let sales_val = sales.value || 0;
    //   // Conditional fill color
    //   if (sales_val < 200000) {
    //     color = 'FF9999';
    //   }

    //   sales.fill = {
    //     type: 'pattern',
    //     pattern: 'solid',
    //     fgColor: { argb: color },
    //   };
    // });

    // worksheet.getColumn(3).width = 20;
    // worksheet.addRow([]);

    //Footer Row
    let footerRow = worksheet.addRow([
      `Địa chỉ giao hàng: ${excelData.diaChiGiaoHang}`,
    ]);
    // footerRow.getCell(1).fill = {
    //   type: 'pattern',
    //   pattern: 'solid',
    //   // fgColor: { argb: 'FFFFFF' },
    // };
    footerRow.font = {
      name: 'Times',
      size: 11,
      bold: true,
      italic: true,
    };
    footerRow.alignment = { vertical: 'middle', horizontal: 'left' };

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, title + '.xlsx');
    });
  }

  resetForm() {
    this.createProductForm.reset();
    this.createProductForm.patchValue({
      maCty: '',
    });
  }
}
