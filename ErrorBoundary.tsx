
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface Props { children: ReactNode; }
interface State { hasError: boolean; }

export class ErrorBoundary extends Component<Props, State> {
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#fcfaf7] dark:bg-zinc-950 text-center">
          <div className="max-w-md space-y-6">
            <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-10 h-10 text-[#e2725b]" />
            </div>
            <h1 className="text-3xl font-black text-gray-800 dark:text-white">يا ويلي! حصل خطأ</h1>
            <p className="text-gray-600 dark:text-zinc-400">يبدو أن هناك مشكلة تقنية بسيطة. جرب تعمل "Refresh" للصفحة.</p>
            <button 
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 mx-auto bg-[#e2725b] text-white px-8 py-3 rounded-2xl font-bold"
            >
              <RefreshCw className="w-5 h-5" /> تحديث الصفحة
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
