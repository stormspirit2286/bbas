import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
// import * as fs from 'file-saver';
// import * as Excel from 'exceljs';
// import * as Excel from 'exceljs/dist/exceljs.min.js';

// import { Anchor, Workbook } from 'exceljs';
// import * as fs from 'file-saver';

@Component({
  selector: 'app-request-production',
  templateUrl: './request-production.component.html',
  styleUrls: ['./request-production.component.scss'],
})
export class RequestProductionComponent implements OnInit {
  createProductForm!: FormGroup;

  List_Customers = [
    {
      id: 1,
      name: 'CÔNG TY TNHH BEHN MEYER AGRICARE VIỆT NAM',
      value: 'KH00001',
      address: '',
    },
    {
      id: 2,
      name: 'CÔNG TY CỔ PHẦN ALLYBUILD VIỆT NAM',
      value: 'KH00002',
      address: '',
    },
    {
      id: 3,
      name: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ SẢN XUẤT THUỐC THÚ Y THỦY SẢN ÁNH VIỆT',
      value: 'KH00003',
      address: '',
    },
    {
      id: 4,
      name: 'CÔNG TY TNHH VẬT LIỆU MỚI AOXIANG VIỆT NAM',
      value: 'KH00004',
      address: '',
    },
    {
      id: 5,
      name: 'CÔNG TY TNHH CÔNG NGHỆ NANO HỢP NHẤT APA',
      value: 'KH00005',
      address: '',
    },
    {
      id: 6,
      name: 'CÔNG TY TNHH AVCO VIỆT NAM',
      value: 'KH00006',
      address: '',
    },
    {
      id: 7,
      name: 'CÔNG TY CỔ PHẦN PHÂN BÓN BA LÁ XANH',
      value: 'KH00007',
      address: '',
    },
    {
      id: 8,
      name: 'CÔNG TY CỔ PHẦN BAO BÌ NHƠN TRẠCH',
      value: 'KH00008',
      address: '',
    },
    { id: 9, name: 'CÔNG TY CỔ PHẦN BESTMIX', value: 'KH00009', address: '' },
    {
      id: 10,
      name: 'CÔNG TY CỔ PHẦN MC-BIFI BAUCHEMIE',
      value: 'KH000011',
      address: '',
    },
    { id: 11, name: 'CÔNG TY TNHH BIO99', value: 'KH000012', address: '' },
  ];

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createProductForm = this.fb.group({
      maCty: ['', Validators.required],
      ngayYeuCau: [new Date(), Validators.required],
      soDonHang: ['', Validators.required],
    });
  }

  // exportExcel() {
  //   // Tạo một workbook mới
  //   const workbook = new Workbook();

  //   // Tạo một worksheet mới
  //   const worksheet = workbook.addWorksheet('Sheet1');

  //   // Thêm logo vào header bên trái
  //   const logo = workbook.addImage({
  //     filename: 'path/to/logo.png',
  //     extension: 'png',
  //   });
  //   worksheet.addImage(logo, {
  //     // tl: { col: 1, row: 1 },
  //     // br: { col: 2, row: 2 },
  //     tl: new Anchor({ col: 1, row: 1 }),
  //     br: new Anchor({ col: 2, row: 2 }),
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

  exportExcel() {}

  resetForm() {}
}
