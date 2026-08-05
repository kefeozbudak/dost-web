const fs = require('fs');

let content = fs.readFileSync('src/pages/PublicView.tsx', 'utf8');

content = content.replace(
  /if \(path \=\=\= '\/' \|\| path \=\=\= '\/home'\) \{/,
  `if (path === '/is-basvurusu') {
      setLoading(true);
      import('../lib/defaultData').then(({ defaultCareerPageData }) => {
        setPageData({
          title: 'İş Başvurusu',
          blocks: defaultCareerPageData
        });
        setLoading(false);
      });
      return;
    }
    
    if (path === '/' || path === '/home') {`
);

fs.writeFileSync('src/pages/PublicView.tsx', content);
