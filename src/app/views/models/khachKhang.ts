export interface KhachHang {
  id: number;
  tenCongTy: string;
  maKhachHang: string;
  diaChiCongTy: string;
  diaChiGiaoHang: string[];
}

export interface SanPham {
  id: string;
  maKhachHang: string;
  maSanPham: string;
  tenSanPham: string;
  chiTietKyThuat: string;
  donViTinh: string;
}
