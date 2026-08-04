const fs = require('fs');
let code = fs.readFileSync('src/components/AssistantWidget.tsx', 'utf8');

const targetFetch = `        if (!response.ok) {
          throw new Error('Server returned ' + response.status);
        }
        data = await response.json();
      } catch (serverErr) {
        // Fallback to client-side Gemini if server endpoint is unavailable (e.g., static hosting)
        const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;`;

const newFetch = `        let errData;
        if (!response.ok) {
          errData = await response.json().catch(() => null);
          throw new Error(errData?.error || 'Server returned ' + response.status);
        }
        data = await response.json();
      } catch (serverErr: any) {
        // Fallback to client-side Gemini if server endpoint is unavailable (e.g., static hosting)
        const clientApiKey = import.meta.env.VITE_GEMINI_API_KEY;`;

code = code.replace(targetFetch, newFetch);

const targetThrow = `          data = { text: r.text };
        } else {
          throw new Error('VITE_GEMINI_API_KEY is not configured for client-side fallback.');
        }
      }`;

const newThrow = `          data = { text: r.text };
        } else {
          throw serverErr;
        }
      }`;

code = code.replace(targetThrow, newThrow);

const targetCatch = `    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Üzgünüm, şu anda bağlantı kuramıyorum. Dilerseniz Hızlı İletişim butonuna tıklayarak bilgilerinizi bırakabilirsiniz.' }]);
    }`;

const newCatch = `    } catch (error: any) {
      setMessages(prev => [...prev, { role: 'assistant', text: 'Hata: ' + (error.message || 'Üzgünüm, bağlantı kurulamadı.') }]);
    }`;

code = code.replace(targetCatch, newCatch);

fs.writeFileSync('src/components/AssistantWidget.tsx', code);
console.log("Fixed AssistantWidget.tsx");
