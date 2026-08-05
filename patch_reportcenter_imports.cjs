const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/ReportCenter.tsx', 'utf8');

file = file.replace(/import { Briefcase, FileCheck, useState, useEffect } from 'react';/, "import { useState, useEffect } from 'react';");
file = file.replace(/import { Briefcase, FileCheck, collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase\/firestore';/, "import { collection, onSnapshot, doc, deleteDoc, updateDoc } from 'firebase/firestore';");
file = file.replace(/import { Briefcase, FileCheck, db } from '\.\.\/\.\.\/lib\/firebase';/, "import { db } from '../../lib/firebase';");
file = file.replace(/import { Briefcase, FileCheck, \n  FileText, Calendar, Trash2, CheckCircle2, Clock, Printer, /, "import { Briefcase, FileCheck, FileText, Calendar, Trash2, CheckCircle2, Clock, Printer, ");
file = file.replace(/import { Briefcase, FileCheck, format } from 'date-fns';/, "import { format } from 'date-fns';");

fs.writeFileSync('./src/admin/hubs/ReportCenter.tsx', file);
