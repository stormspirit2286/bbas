import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { KhachHang } from '../models/khachKhang';

@Component({
  selector: 'app-code-product',
  templateUrl: './code-product.component.html',
  styleUrls: ['./code-product.component.scss'],
})
export class CodeProductComponent implements OnInit {
  codeProductForm!: FormGroup;
  maSP: string = '';

  List_SP_Current: {
    id: number;
    name: string;
    value: string;
    idNganh: string;
  }[] = [];
  listCurrentCompany: KhachHang[] = [];

  List_Customers = [
    {
      id: 1,
      name: 'CÔNG TY TNHH BEHN MEYER AGRICARE VIỆT NAM',
      value: 'KH00001',
    },
    { id: 2, name: 'CÔNG TY CỔ PHẦN ALLYBUILD VIỆT NAM', value: 'KH00002' },
    {
      id: 3,
      name: 'CÔNG TY TNHH THƯƠNG MẠI DỊCH VỤ SẢN XUẤT THUỐC THÚ Y THỦY SẢN ÁNH VIỆT',
      value: 'KH00003',
    },
    {
      id: 4,
      name: 'CÔNG TY TNHH VẬT LIỆU MỚI AOXIANG VIỆT NAM',
      value: 'KH00004',
    },
    {
      id: 5,
      name: 'CÔNG TY TNHH CÔNG NGHỆ NANO HỢP NHẤT APA',
      value: 'KH00005',
    },
    { id: 6, name: 'CÔNG TY TNHH AVCO VIỆT NAM', value: 'KH00006' },
    { id: 7, name: 'CÔNG TY CỔ PHẦN PHÂN BÓN BA LÁ XANH', value: 'KH00007' },
    { id: 8, name: 'CÔNG TY CỔ PHẦN BAO BÌ NHƠN TRẠCH', value: 'KH00008' },
    { id: 9, name: 'CÔNG TY CỔ PHẦN BESTMIX', value: 'KH00009' },
    { id: 10, name: 'CÔNG TY CỔ PHẦN MC-BIFI BAUCHEMIE', value: 'KH00011' },
    { id: 11, name: 'CÔNG TY TNHH BIO99', value: 'KH00012' },
  ];

  LIST_NGANH = [
    { id: 1, name: 'Nông nghiệp', value: 'NN' },
    { id: 2, name: 'Phân bón', value: 'PB' },
    { id: 3, name: 'Xây dựng', value: 'XD' },
    { id: 4, name: 'Hạt nhựa', value: 'HN' },
    { id: 5, name: 'Hoá chất', value: 'HC' },
    { id: 6, name: 'Thức ăn chăn nuôi', value: 'TA' },
    { id: 7, name: 'Than', value: 'TH' },
    { id: 8, name: 'Bột - Thực phẩm', value: 'BT' },
    { id: 9, name: 'Đất', value: 'ĐA' },
    { id: 10, name: 'Giấy', value: 'GI' },
    { id: 11, name: 'Khác', value: 'KH' },
  ];

  LIST_SAN_PHAM = [
    { id: 1, name: 'Gạo', value: '1', idNganh: 'NN' },
    { id: 2, name: 'Lúa giống', value: '2', idNganh: 'NN' },
    { id: 3, name: 'Bắp giống', value: '3', idNganh: 'NN' },
    { id: 4, name: 'Tiêu', value: '4', idNganh: 'NN' },
    { id: 5, name: 'NPK', value: '1', idNganh: 'PB' },
    { id: 6, name: 'Hữu cơ vi sinh', value: '2', idNganh: 'PB' },
    { id: 7, name: 'Trung vi lượng', value: '3', idNganh: 'PB' },
    { id: 6, name: 'Thuốc', value: '4', idNganh: 'PB' },
    { id: 7, name: 'DAP', value: '5', idNganh: 'PB' },
    { id: 8, name: 'Đạm', value: '6', idNganh: 'PB' },
    { id: 9, name: 'Lân', value: '7', idNganh: 'PB' },
    { id: 10, name: 'Bột trét tường', value: '1', idNganh: 'XD' },
    { id: 11, name: 'Keo dán gạch', value: '2', idNganh: 'XD' },
    { id: 12, name: 'Keo chà ron', value: '3', idNganh: 'XD' },
    { id: 13, name: 'Phụ gia xây dựng', value: '4', idNganh: 'XD' },
    { id: 14, name: 'Keo chít mạch', value: '5', idNganh: 'XD' },
    { id: 15, name: 'Viên kê bê tông', value: '6', idNganh: 'XD' },
    { id: 16, name: 'Xi măng', value: '7', idNganh: 'XD' },
    { id: 17, name: 'Hạt nhựa', value: '1', idNganh: 'HN' },
    { id: 18, name: 'Hoá chất công nghiệp', value: '1', idNganh: 'HC' },
    { id: 19, name: 'Hoá chất thuỷ sản', value: '2', idNganh: 'HC' },

    { id: 20, name: 'Thức ăn chăn nuôi', value: '1', idNganh: 'TA' },
    { id: 21, name: 'Phụ gia thức ăn', value: '2', idNganh: 'TA' },
    { id: 22, name: 'Thức ăn thuỷ sản', value: '3', idNganh: 'TA' },
    { id: 23, name: 'Thuốc thú y', value: '4', idNganh: 'TA' },
    { id: 24, name: 'Than', value: '1', idNganh: 'TH' },

    { id: 25, name: 'Bột mì', value: '1', idNganh: 'BT' },
    { id: 26, name: 'Bột thực phẩm', value: '2', idNganh: 'BT' },

    { id: 27, name: 'Đất sạch', value: '1', idNganh: 'ĐA' },
    { id: 28, name: 'Giá thể', value: '2', idNganh: 'ĐA' },

    { id: 29, name: 'Giấy Kraft', value: '1', idNganh: 'GI' },
    { id: 30, name: 'Khác', value: '1', idNganh: 'KH' },
  ];

  List_Dong_SP = [
    { id: 1, name: 'Bao BOPP in ống đồng (may đáy)', value: 'BP' },
    { id: 2, name: 'Bao Giấy Kraft ghép PP', value: 'KP' },
    { id: 3, name: 'Bao giấy in offset', value: 'OP' },
    { id: 4, name: 'Bao Mentalize', value: 'MP' },
    { id: 5, name: 'Bao PA/PE', value: 'AE' },
    { id: 6, name: 'Giấy Kraft tráng PE', value: 'KT' },
    { id: 7, name: 'Nẹp', value: 'NE' },
    { id: 8, name: 'Bao đáy vuông', value: 'DV' },
    { id: 9, name: 'Nẹp', value: 'NE' },
    { id: 10, name: 'Túi PP', value: 'TU' },
  ];

  constructor(private fb: FormBuilder) {}
  ngOnInit() {
    this.codeProductForm = this.fb.group({
      maKhachHang: ['', Validators.required],
      maNganh: ['', Validators.required],
      maSanPham: ['', Validators.required],
      maDongSanPham: ['', Validators.required],
      content: ['', Validators.required],
    });
    this.listCurrentCompany =
      JSON.parse(localStorage.getItem('DanhSachCongTy') || '[]') || [];
  }

  handleChangeNganh() {
    this.List_SP_Current = this.LIST_SAN_PHAM.filter(
      (item) => item.idNganh === this.codeProductForm.value.maNganh
    );
  }

  resetForm() {
    this.codeProductForm.patchValue({
      maKhachHang: '',
      maNganh: '',
      maSanPham: '',
      maDongSanPham: '',
      content: '',
    });
    this.maSP = '';
  }

  generateMaSP() {
    const arest = this.codeProductForm.value.content
      .toString()
      .padStart(4, '0');

    this.maSP = `${this.codeProductForm.value.maNganh}${this.codeProductForm.value.maSanPham}${this.codeProductForm.value.maKhachHang}${this.codeProductForm.value.maDongSanPham}${arest}`;
  }
}
