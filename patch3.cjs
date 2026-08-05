const fs = require('fs');
let file = fs.readFileSync('./src/admin/hubs/AppearanceCenter.tsx', 'utf8');

file = file.replace("import { resolveMediaUrls } from '../../lib/resolveMedia';", "");
file = file.replace("if (headerDoc.exists()) resolveMediaUrls(headerDoc.data()).then(res => setHeaderData(res));", "if (headerDoc.exists()) setHeaderData(headerDoc.data());");
file = file.replace("if (footerDoc.exists()) resolveMediaUrls(footerDoc.data()).then(res => setFooterData(res));", "if (footerDoc.exists()) setFooterData(footerDoc.data());");

const previewImgCode = `
const PreviewImage = ({ src, alt, className, style }: any) => {
  const [resolved, setResolved] = useState(src);
  useEffect(() => {
    if (src && typeof src === 'string' && src.startsWith('/api/media/')) {
      const mediaId = src.split('/api/media/')[1];
      getDoc(doc(db, 'media', mediaId)).then(snap => {
        if (snap.exists() && snap.data().url) setResolved(snap.data().url);
      }).catch(()=>{});
    } else {
      setResolved(src);
    }
  }, [src]);
  if (!resolved) return null;
  return <img src={resolved} alt={alt} className={className} style={style} />;
};
`;

file = file.replace("const compressImage = (file: File", previewImgCode + "\nconst compressImage = (file: File");

file = file.replace(/<img src=\{headerData.logoUrl\}/g, "<PreviewImage src={headerData.logoUrl}");
file = file.replace(/<img src=\{col.image\}/g, "<PreviewImage src={col.image}");
file = file.replace(/<img\s+src=\{footerData.logoUrl\}/g, "<PreviewImage src={footerData.logoUrl}");

fs.writeFileSync('./src/admin/hubs/AppearanceCenter.tsx', file);
