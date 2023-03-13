import { ToastrService } from 'ngx-toastr';
import {
  DonHang,
  GHI_CHU,
  imgBase64,
  KhachHang,
  SanPham,
} from './../models/khachKhang';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as fs from 'file-saver';
import { freeSet } from '@coreui/icons';

import * as Excel from 'exceljs';
import { debounceTime, distinctUntilChanged, of, switchMap } from 'rxjs';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-request-production',
  templateUrl: './request-production.component.html',
  styleUrls: ['./request-production.component.scss'],
})
export class RequestProductionComponent implements OnInit {
  @ViewChild('fondovalor') fondovalor!: ElementRef;
  idAddMoreAddress = false;
  icons = freeSet;
  createProductForm!: FormGroup;
  currentKhachHang?: KhachHang;
  listCurrentCompany: KhachHang[] = [];
  listProducts: SanPham[] = [];
  listProductsByCompany: SanPham[] = [];
  listProductsSelected: SanPham[] = [];
  listDiaChiGiaoHang?: { address: string }[] = [];
  dataToProduct: DonHang[] = [];
  GHI_CHU = GHI_CHU;
  today: any;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private datePipe: DatePipe
  ) {
    this.today = this.datePipe.transform(new Date(), 'dd_MM_YYYY');
  }

  ngOnInit() {
    this.createProductForm = this.fb.group({
      maKhachHang: ['', Validators.required],
      ngayYeuCau: [new Date(), Validators.required],
      soDonHang: ['', Validators.required],
      diaChiGiaoHang: ['', Validators.required],
      danhSachSanPham: this.fb.array([]),
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
        this.listProductsByCompany = this.listProducts.filter(
          (item) => item.maKhachHang === data
        );
        this.listDiaChiGiaoHang = [];
        this.listDiaChiGiaoHang = this.currentKhachHang?.diaChiGiaoHang;
        this.addDanhSachDH();
      });
  }

  get danhSachSanPham(): FormArray {
    return this.createProductForm.get('danhSachSanPham') as FormArray;
  }

  addMoreAddress() {
    this.idAddMoreAddress = !this.idAddMoreAddress;
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

  handleChange(event: any, data: any) {
    const { soLuong, ngayCanGiaoHang, ghiChu } = data.controls;
    event.target.checked
      ? [soLuong, ngayCanGiaoHang, ghiChu].forEach((control) =>
          control.enable()
        )
      : [soLuong, ngayCanGiaoHang, ghiChu].forEach((control) =>
          control.disable()
        );
  }

  exportExcel() {
    const dsSP = this.createProductForm.value.danhSachSanPham.filter(
      (item: any) => item.isChecked
    );

    const prepareData = {
      soDonHang: this.createProductForm.value.soDonHang,
      maKhachHang: this.createProductForm.value.maKhachHang,
      tenKhachHang: this.currentKhachHang?.tenCongTy,
      diaChiKhachHang: this.currentKhachHang?.diaChiCongTy,
      diaChiGiaoHang: this.createProductForm.value.diaChiGiaoHang,
      ngayYeuCau: this.datePipe.transform(
        this.createProductForm.value.ngayYeuCau,
        'dd/MM/yyyy'
      ),
      title: 'PHIẾU YÊU CẦU SẢN XUẤT',
      dsSanPham: dsSP.map((item: any, index: number) => {
        delete item.isChecked;
        item.STT = index + 1;
        item.ngayCanGiaoHang = this.datePipe.transform(
          item.ngayCanGiaoHang,
          'dd/MM/yyyy'
        );
        return item;
      }),
      // data: this.dataForExcel,
      headers: [
        'STT',
        'Mã sản phẩm',
        'Tên sản phẩm',
        'Chi tiết kỹ thuật',
        'ĐVT',
        'Số lượng',
        'Ngày cần\ngiao hàng',
        'Ghi chú',
      ],
    };
    // console.log(prepareData);
    this.exportToExcel(prepareData);
  }

  exportToExcel(excelData: any) {
    if (!this.currentKhachHang?.tenThuongGoi) {
      this.toastr.warning(
        'Công ty này chưa có tên thường gọi, vui lòng cập nhật lại'
      );
      return;
    }
    const { title, headers, dsSanPham } = excelData;
    //Create a workbook with a worksheet
    let workbook = new Excel.Workbook();
    let worksheet = workbook.addWorksheet('BBAS');

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
    titleRow.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

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
    maSo.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
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
    ngAyBanHanh.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
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
    lanBanHanh.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

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
    soTrang.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };

    // Ngày yêu cầu
    worksheet.mergeCells('A6:H6');
    let ngayYeuCau = worksheet.getCell('A6');
    ngayYeuCau.value = `1. Ngày yêu cầu: ${excelData.ngayYeuCau}`;
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
    diaChiCty.value = `3. Địa chỉ: ${excelData.diaChiKhachHang}`;
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
    soDonHang.value = `5. Số đơn hàng: ${excelData.soDonHang}`;
    soDonHang.font = {
      name: 'Times',
      size: 11,
      bold: true,
    };
    soDonHang.alignment = { vertical: 'middle', horizontal: 'left' };

    //Add Image
    const myLogoImage = workbook.addImage({
      base64: imgBase64,
      extension: 'png',
    });

    worksheet.mergeCells('A1:B4');
    worksheet.addImage(myLogoImage, 'A1:B4');

    const imageCell = worksheet.getCell('A1');
    // Thiết lập kiểu viền cho ô đó
    imageCell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    imageCell.alignment = { wrapText: true };

    const diaChiRow = worksheet.getRow(8);
    diaChiRow.height = 15;

    //Blank Row
    worksheet.addRow([]);

    const headerRowS = worksheet.addRow(headers);
    headerRowS.eachCell((cell, colNumber) => {
      cell.font = {
        name: 'Times',
        size: 11,
        bold: true,
      };
      cell.border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
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

    const columnSTT = worksheet.getColumn('A');
    columnSTT.width = 5;
    const columnMaSP = worksheet.getColumn('B');
    columnMaSP.width = 20;
    const columnTenSP = worksheet.getColumn('C');
    columnTenSP.width = 22;
    const chiTietKT = worksheet.getColumn('D');
    chiTietKT.width = 50;
    const DVT = worksheet.getColumn('E');
    DVT.width = 7;
    const soLuong = worksheet.getColumn('F');
    soLuong.width = 11;
    const ngayGiaoHang = worksheet.getColumn('G');
    ngayGiaoHang.width = 12;
    const ghiChu = worksheet.getColumn('H');
    ghiChu.width = 12;

    dsSanPham.forEach((product: any, index: number) => {
      const rowData = [
        product.STT,
        product.maSanPham,
        product.tenSanPham,
        product.chiTietKyThuat,
        product.donViTinh,
        product.soLuong,
        product.ngayCanGiaoHang,
        product.ghiChu,
      ];
      const newRow = worksheet.addRow(rowData);
      newRow.eachCell((cell, colNumber) => {
        cell.border = {
          top: { style: 'thin' },
          left: { style: 'thin' },
          bottom: { style: 'thin' },
          right: { style: 'thin' },
        };
        cell.alignment = {
          vertical: 'middle',
          horizontal: 'center',
          wrapText: true,
        };
        cell.font = {
          name: 'Times',
          size: 11,
        };
      });
    });

    // Định dạng lại các cột trong bảng
    worksheet.columns.forEach((column: any) => {});

    //Footer Row
    const footerRow = worksheet.addRow([
      `Địa chỉ giao hàng: ${excelData.diaChiGiaoHang}`,
    ]);
    footerRow.font = {
      name: 'Times',
      size: 11,
      bold: true,
      italic: true,
    };
    footerRow.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };
    footerRow.height = 18;

    //Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:H${footerRow.number}`);

    //Blank Row
    worksheet.addRow([]);

    // const header = [
    //   'Người lập phiếu\nRequested by',
    //   'Trưởng phòng kinh doanh\nSale manager',
    //   'Kế toán giá\nCost accounting',
    //   'Ban giám đốc\nDirector',
    // ];
    // const headertable2 = worksheet.addRow(header);
    // headertable2.height = 70;
    // headertable2.border = {
    //   top: { style: 'thin' },
    //   left: { style: 'thin' },
    //   bottom: { style: 'thin' },
    //   right: { style: 'thin' },
    // };
    // headertable2.alignment = {
    //   vertical: 'middle',
    //   horizontal: 'center',
    //   wrapText: true,
    // };
    // headertable2.font = {
    //   name: 'Times',
    //   size: 11,
    // };
    // const dataRow: any = [];
    // worksheet.addRow(dataRow);

    // Lấy số hàng cuối cùng của sheet
    // const lastRow = worksheet.lastRow().number;
    const lastRow = worksheet.rowCount;

    // Tạo bảng
    const tableHeader = [
      'Người lập phiếu',
      'Trưởng phòng kinh doanh',
      'Kế toán giá',
      'Ban giám đốc',
    ];
    worksheet.mergeCells(`A${lastRow + 1}:D${lastRow + 1}`);
    const tableRow = worksheet.getRow(lastRow + 1);
    tableRow.values = tableHeader;

    // Định dạng bảng
    tableRow.height = 25;
    tableRow.alignment = { horizontal: 'center', vertical: 'middle' };
    tableRow.font = { bold: true };

    for (let col = 1; col <= 4; col++) {
      worksheet.getColumn(col).width = 20;
      worksheet.getCell(lastRow + 2, col).border = {
        top: { style: 'thin' },
        left: { style: 'thin' },
        bottom: { style: 'thin' },
        right: { style: 'thin' },
      };
    }

    worksheet.getRow(lastRow + 2).height = 30;
    worksheet.views = [{ state: 'frozen', ySplit: lastRow + 2 }];
    //Generate & Save Excel File
    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(
        blob,
        `${title}_${this.currentKhachHang?.tenThuongGoi}_${this.today}.xlsx`
      );
    });
  }

  resetForm() {
    this.createProductForm.reset();
    this.createProductForm.patchValue({
      diaChiGiaoHang: '',
    });
    this.listProductsByCompany = [];
    this.danhSachSanPham.clear();
  }

  checkOrUncheck(item: SanPham) {
    item.isChecked = !item.isChecked;
    const index = this.dataToProduct.findIndex((data) => data?.id === item.id);
    if (index !== -1) {
      this.dataToProduct.splice(index, 1);
    } else {
      this.dataToProduct.push(item);
    }
  }
}
