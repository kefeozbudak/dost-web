const fs = require('fs');
let code = fs.readFileSync('src/admin/hubs/ClubCenter.tsx', 'utf8');
code = code.replace(
    /studentname: 'Öğrenci Adı Soyadı',/,
    "studentname: 'Öğrenci Adı Soyadı', club: 'Seçilen Kulüp', studentcampus: 'Kampüs', studentclass: 'Sınıf',"
);
code = code.replace(
    /studentName: "Öğrenci Adı",/,
    'studentName: "Öğrenci Adı", club: "Seçilen Kulüp", studentCampus: "Kampüs", studentClass: "Sınıf",'
);
fs.writeFileSync('src/admin/hubs/ClubCenter.tsx', code);
