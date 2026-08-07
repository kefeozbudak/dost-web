with open('src/admin/hubs/PagesCenter.tsx', 'r') as f:
    c = f.read()

c = c.replace(
'''      fetchedPages.sort((a: any, b: any) => {
        const timeA = typeof a.createdAt === 'number' ? a.createdAt : new Date(a.createdAt || 0).getTime();
        const timeB = typeof b.createdAt === 'number' ? b.createdAt : new Date(b.createdAt || 0).getTime();
        return timeB - timeA;
      });''',
'''      fetchedPages.sort((a: any, b: any) => {
        const getTime = (val: any) => {
          if (!val) return 0;
          if (typeof val === 'number') return val;
          if (val.toMillis) return val.toMillis();
          if (val.seconds) return val.seconds * 1000;
          return new Date(val).getTime() || 0;
        };
        return getTime(b.createdAt) - getTime(a.createdAt);
      });'''
)

with open('src/admin/hubs/PagesCenter.tsx', 'w') as f:
    f.write(c)
