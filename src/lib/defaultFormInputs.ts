export const DEFAULT_PRE_REGISTRATION_INPUTS = [
  { type: 'section_title', label: 'Öğrenci Bilgileri', icon: 'school' },
  { type: 'text', name: 'student_fullname', label: 'Öğrenci Adı Soyadı', placeholder: 'Örn: Ahmet Yılmaz', required: true },
  { type: 'text', name: 'student_tc', label: 'T.C. Kimlik Numarası', placeholder: '11 Haneli T.C. Kimlik No', required: true },
  { type: 'date', name: 'dob', label: 'Doğum Tarihi', required: true },
  { type: 'select', name: 'gender', label: 'Cinsiyet', options: 'Erkek, Kız', required: true },
  { type: 'select', name: 'grade', label: 'Mevcut Sınıf Seviyesi', options: 'Okul Öncesi, 1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf, Lise Hazırlık / 9. Sınıf', required: true, fullWidth: true },
  { type: 'section_title', label: 'Veli Bilgileri', icon: 'family_restroom' },
  { type: 'text', name: 'parent_fullname', label: 'Veli Adı Soyadı', placeholder: 'Örn: Mehmet Yılmaz', required: true },
  { type: 'text', name: 'parent_tc', label: 'T.C. Kimlik Numarası', placeholder: '11 Haneli T.C. Kimlik No', required: true },
  { type: 'tel', name: 'phone', label: 'Telefon Numarası', placeholder: '05XX XXX XX XX', required: true },
  { type: 'email', name: 'email', label: 'E-posta Adresi', placeholder: 'ornek@email.com', required: true },
  { type: 'select', name: 'relation', label: 'Öğrenciye Yakınlık Derecesi', options: 'Anne, Baba, Vasi / Diğer', required: true, fullWidth: true },
  { type: 'section_title', label: 'Kampüs ve Tercihler', icon: 'location_on' },
  { type: 'select', name: 'campus', label: 'Kampüs Seçimi', options: 'Eryaman Kampüsü, Oran Kampüsü, Ümitköy Kampüsü', required: true },
  { type: 'select', name: 'academic_year', label: 'Akademik Yıl', options: '2024 - 2025, 2025 - 2026', required: true },
  { type: 'select', name: 'referral', label: 'Bizi nereden duydunuz?', options: 'Sosyal Medya, Tavsiye, Billboard / Açık Hava, İnternet Reklamları, Diğer', required: false, fullWidth: true }
];

export const DEFAULT_CLUB_INPUTS = [
  { type: 'section_title', label: 'Öğrenci Bilgileri', icon: 'person' },
  { type: 'text', name: 'studentName', label: 'Adı Soyadı', placeholder: 'Örn: Ahmet Yılmaz', required: true },
  { type: 'select', name: 'studentCampus', label: 'Kampüs Seçimi', options: 'Eryaman Kampüsü, Oran Kampüsü, Ümitköy Kampüsü', required: true },
  { type: 'select', name: 'studentClass', label: 'Sınıfı', options: '1. Sınıf, 2. Sınıf, 3. Sınıf, 4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf', required: true },
  { type: 'section_title', label: 'Veli İletişim Bilgileri', icon: 'contact_phone' },
  { type: 'text', name: 'parentName', label: 'Veli Adı Soyadı', placeholder: 'Örn: Mehmet Yılmaz', required: true },
  { type: 'tel', name: 'parentPhone', label: 'Telefon Numarası', placeholder: '0(5xx) xxx xx xx', required: true },
  { type: 'checkbox', name: 'kvkkConsent', label: 'KVKK Aydınlatma Metni\'ni okudum, kişisel verilerimin kulüp kaydı amacıyla işlenmesini onaylıyorum.', required: true }
];

export const DEFAULT_SCHOLARSHIP_INPUTS = [
  { type: 'section_title', label: 'Öğrenci Bilgileri', icon: 'school' },
  { type: 'text', name: 'student_fullname', label: 'Öğrenci Adı Soyadı', placeholder: 'Örn: Ahmet Yılmaz', required: true },
  { type: 'text', name: 'student_tc', label: 'T.C. Kimlik No', placeholder: '11 haneli kimlik numarası', required: false },
  { type: 'text', name: 'current_school', label: 'Mevcut Okul', placeholder: 'Halen devam edilen okul', required: false },
  { type: 'select', name: 'grade_level', label: 'Sınıf Seviyesi', options: '4. Sınıf, 5. Sınıf, 6. Sınıf, 7. Sınıf, 8. Sınıf, 9. Sınıf, 10. Sınıf, 11. Sınıf', required: true },
  { type: 'section_title', label: 'Veli Bilgileri', icon: 'family_restroom' },
  { type: 'text', name: 'parent_fullname', label: 'Veli Adı Soyadı', placeholder: 'Örn: Mehmet Yılmaz', required: true },
  { type: 'tel', name: 'parent_phone', label: 'Telefon Numarası', placeholder: '05XX XXX XX XX', required: true },
  { type: 'email', name: 'parent_email', label: 'E-posta Adresi', placeholder: 'ornek@mail.com', required: false, fullWidth: true },
  { type: 'select', name: 'discovery_source', label: 'Bizi nereden buldunuz?', options: 'Sosyal Medya, İnternet Reklamları, Tavsiye, Okul Afişleri/Bilboardlar, Diğer', required: false, fullWidth: true },
  { type: 'section_title', label: 'Sınav Tercihi', icon: 'location_on' },
  { type: 'select', name: 'campus_preference', label: 'Kampüs Seçimi', options: 'Eryaman Kampüsü, Oran Kampüsü, Ümitköy Kampüsü', required: true },
  { type: 'select', name: 'exam_session', label: 'Sınav Saati', options: 'Seans 1: 10:00, Seans 2: 14:00', required: false }
];
