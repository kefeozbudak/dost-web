import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      const isDomError =
        this.state.error?.message?.includes('insertBefore') ||
        this.state.error?.message?.includes('removeChild') ||
        this.state.error?.message?.includes('Node');

      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-slate-800 p-6 font-sans">
          <div className="bg-white p-8 rounded-2xl shadow-xl max-w-lg w-full text-center border border-slate-200">
            <h1 className="text-2xl font-bold text-red-600 mb-2">Bir Hata Oluştu</h1>
            <p className="text-slate-600 mb-4 text-sm leading-relaxed">
              {isDomError
                ? "Tarayıcı otomatik çevirisi (Google Translate) veya bir eklenti sayfa metinlerini değiştirdiği için geçici bir DOM senkronizasyon hatası oluştu."
                : "Uygulama çalışırken beklenmedik bir hata meydana geldi. Önbelleğe alınmış eski dosyalar buna sebep olabilir."}
            </p>
            <div className="bg-slate-100 p-4 rounded-xl text-left overflow-auto text-xs text-slate-700 font-mono mb-6 max-h-40 border border-slate-200">
              {this.state.error?.toString()}
            </div>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={this.handleReset}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xs cursor-pointer"
              >
                Yeniden Dene / Devam Et
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-xl text-sm font-bold transition-all cursor-pointer"
              >
                Sayfayı Yenile
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

