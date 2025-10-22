export interface LoginVariables {
  nip: string
  password: string
  captcha?: string
}

export interface Pivot {
  users_id: string
  users_rule_id: string
}

export interface UserRule {
  id: string
  rule: string
  created_at: string
  updated_at: string
  deleted_at: string | null
  pivot: Pivot
}

export interface User {
  id: number
  nik: string
  nip: string
  name: string
  email: string
  no_hp: string
  kd_opd1: string
  kd_opd2: string
  kd_opd3: string
  kd_opd4: string
  kd_opd5: string
  image: string
  is_active: string
  date_created: string | null
  visualisasi_tte: string | null
  deleted: string
  chat_id: string | null
  updated_at: string
  rules: UserRule[] // 👈 daftar role yang dimiliki user
}

export interface LoginResponse {
  user: User
  token: string
}
