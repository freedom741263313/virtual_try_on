import React, { useState, useRef, useCallback } from 'react';
import { Upload, X, RefreshCw, Wand2, ArrowRightLeft, Camera, Image as ImageIcon, Download } from 'lucide-react';
import { AppState, GeneratedImage, StyleOption } from './types';
import { MAX_FILE_SIZE_MB, ALLOWED_FILE_TYPES } from './constants';
import { generateOutfitChange } from './services/geminiService';
import { LoadingOverlay } from './components/LoadingOverlay';
import { StyleSelector } from './components/StyleSelector';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<GeneratedImage | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isComparing, setIsComparing] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      setErrorMessage("Please upload a valid image (JPEG, PNG, WebP).");
      return;
    }

    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File size too large. Max ${MAX_FILE_SIZE_MB}MB.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setCurrentImage(result);
      setGeneratedImage(null);
      setSelectedStyleId(null);
      setAppState(AppState.IDLE);
      setErrorMessage(null);
    };
    reader.readAsDataURL(file);
  };

  const processOutfitChange = async (prompt: string, styleId: string) => {
    if (!currentImage) return;

    setAppState(AppState.PROCESSING);
    setErrorMessage(null);
    setSelectedStyleId(styleId);

    try {
      // Extract MIME type from Data URL
      const mimeType = currentImage.match(/data:([^;]+);/)?.[1] || 'image/png';
      
      const resultBase64 = await generateOutfitChange(currentImage, mimeType, prompt);
      
      setGeneratedImage({
        original: currentImage,
        modified: resultBase64,
        styleId: styleId
      });
      setAppState(AppState.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to generate outfit. Please try again or choose a different photo.");
      setAppState(AppState.ERROR);
    }
  };

  const handleStyleSelect = useCallback((style: StyleOption) => {
    if (!currentImage) {
        setErrorMessage("Please upload an image first.");
        return;
    }
    if (appState === AppState.PROCESSING) return;

    processOutfitChange(style.prompt, style.id);
  }, [currentImage, appState]);

  const handleCustomStyleSelect = useCallback((customPrompt: string) => {
    if (!currentImage) {
      setErrorMessage("Please upload an image first.");
      return;
    }
    if (appState === AppState.PROCESSING) return;

    processOutfitChange(customPrompt, 'custom');
  }, [currentImage, appState]);

  const resetApp = () => {
    setCurrentImage(null);
    setGeneratedImage(null);
    setSelectedStyleId(null);
    setAppState(AppState.IDLE);
    setErrorMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const activeImage = isComparing && generatedImage ? generatedImage.original : (generatedImage?.modified || currentImage);

  return (
    <div className="h-screen bg-slate-950 text-white selection:bg-purple-500 selection:text-white flex flex-col overflow-hidden font-sans">
      {/* Compact Header */}
      <header className="h-14 border-b border-white/10 bg-slate-900/50 backdrop-blur-md flex items-center px-6 shrink-0 z-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
              <Wand2 className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              Gemini Vogue
            </h1>
          </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 overflow-hidden">
        <div className="grid lg:grid-cols-12 gap-6 h-full">
          
          {/* LEFT COLUMN: CONTROLS */}
          <div className="lg:col-span-4 flex flex-col gap-4 h-full overflow-hidden">
             
             {/* Upload / Status Card */}
             <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg shrink-0">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Control Panel</h2>
                
                <div className="flex gap-2 mb-4">
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2.5 px-4 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 shadow-lg shadow-purple-900/20"
                  >
                    <Upload className="w-4 h-4" />
                    {currentImage ? 'Change Photo' : 'Upload Photo'}
                  </button>
                  {currentImage && (
                    <button 
                       onClick={resetApp}
                       className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl transition-colors border border-white/5"
                       title="Clear All"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileUpload} 
                  className="hidden" 
                  accept={ALLOWED_FILE_TYPES.join(',')}
                />

                {errorMessage && (
                  <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-xs text-red-200 flex items-start gap-2 animate-pulse">
                     <span className="mt-0.5">⚠️</span>
                     {errorMessage}
                  </div>
                )}

                {appState === AppState.PROCESSING && (
                  <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg text-xs text-purple-200 flex items-center gap-2 animate-pulse">
                     <RefreshCw className="w-3 h-3 animate-spin" />
                     Creating your new look...
                  </div>
                )}
             </div>

             {/* Style List */}
             <div className="bg-slate-900 border border-white/10 rounded-2xl p-5 shadow-lg flex-1 overflow-hidden flex flex-col min-h-0">
               {currentImage ? (
                  <StyleSelector 
                     onSelect={handleStyleSelect}
                     onCustomSelect={handleCustomStyleSelect}
                     selectedId={selectedStyleId}
                     disabled={appState === AppState.PROCESSING}
                  />
               ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-500 gap-3 opacity-50">
                    <ImageIcon className="w-10 h-10" />
                    <p className="text-sm text-center px-4">Upload a photo to unlock styles</p>
                  </div>
               )}
             </div>

             {/* Footer / Tip */}
             <div className="bg-slate-900/50 border border-white/5 rounded-xl p-4 shrink-0 hidden md:block">
               <div className="flex items-center gap-2 text-xs text-slate-400">
                  <Camera className="w-3 h-3" />
                  <span>Tip: Use a full-body shot for best results.</span>
               </div>
             </div>
          </div>


          {/* RIGHT COLUMN: PREVIEW */}
          <div className="lg:col-span-8 h-full min-h-[400px]">
             <div className="h-full bg-slate-800/30 border border-white/5 rounded-2xl relative overflow-hidden flex items-center justify-center p-4 md:p-8 backdrop-blur-sm">
                
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/40 via-slate-900/0 to-transparent pointer-events-none" />

                {!activeImage ? (
                  <div className="text-center relative z-10 p-6">
                    <div className="w-20 h-20 bg-slate-800/80 rounded-full flex items-center justify-center mx-auto mb-6 ring-1 ring-white/10 shadow-xl">
                      <Wand2 className="w-8 h-8 text-slate-500" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-300 mb-2">Preview Area</h3>
                    <p className="text-slate-500 max-w-sm mx-auto text-sm">
                      Upload a photo on the left to start your virtual transformation.
                    </p>
                  </div>
                ) : (
                  <div className="relative h-full w-full flex items-center justify-center group">
                    <img 
                      src={activeImage} 
                      alt="Preview" 
                      className="max-h-full max-w-full md:max-w-md w-auto h-auto object-contain rounded-lg shadow-2xl transition-all duration-300 ring-1 ring-white/10 bg-slate-900/50"
                    />
                    
                    {/* Floating Actions on Image */}
                    <div className="absolute bottom-6 flex gap-3 z-20">
                      {generatedImage && (
                        <>
                           <button
                            onMouseDown={() => setIsComparing(true)}
                            onMouseUp={() => setIsComparing(false)}
                            onMouseLeave={() => setIsComparing(false)}
                            onTouchStart={() => setIsComparing(true)}
                            onTouchEnd={() => setIsComparing(false)}
                            className="px-5 py-2.5 bg-slate-900/90 backdrop-blur text-white text-sm font-medium rounded-full border border-white/20 hover:bg-slate-800 transition-all flex items-center gap-2 shadow-xl hover:scale-105 active:scale-95 cursor-pointer select-none"
                          >
                            <ArrowRightLeft className="w-4 h-4" />
                            <span className="hidden sm:inline">Hold to Compare</span>
                          </button>

                          <a 
                            href={generatedImage.modified} 
                            download={`gemini-vogue-${Date.now()}.png`}
                            className="px-5 py-2.5 bg-purple-600/90 backdrop-blur text-white text-sm font-medium rounded-full border border-white/20 hover:bg-purple-500 transition-all flex items-center gap-2 shadow-xl shadow-purple-900/20 hover:scale-105 active:scale-95"
                          >
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Save Look</span>
                          </a>
                        </>
                      )}
                    </div>
                  </div>
                )}
                
                <LoadingOverlay isVisible={appState === AppState.PROCESSING} message="Weaving your new style..." />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;