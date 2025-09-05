import React, { useState } from 'react';
import { QrCode, Download, Share2 } from 'lucide-react';

const QRCodeComponent = ({ url = 'https://example.com', size = 200 }) => {
  const [isGenerated, setIsGenerated] = useState(false);

  const generateQR = () => {
    setIsGenerated(true);
  };

  const downloadQR = () => {
    // Simulate download
    console.log('Downloading QR code...');
  };

  return (
    <div className="bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl p-6 shadow-2xl">
      <div className="text-center">
        <h3 className="text-xl font-bold text-slate-900 mb-4">Share Post</h3>
        
        <div className="relative mx-auto mb-6" style={{ width: size, height: size }}>
          {isGenerated ? (
            <div className="w-full h-full bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl p-4 shadow-lg">
              {/* QR Code Pattern Simulation */}
              <div className="w-full h-full bg-white rounded-xl p-2">
                <div className="grid grid-cols-8 grid-rows-8 gap-1 h-full">
                  {Array.from({ length: 64 }, (_, i) => (
                    <div
                      key={i}
                      className={`${
                        Math.random() > 0.5 ? 'bg-slate-900' : 'bg-white'
                      } rounded-sm`}
                    />
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div 
              className="w-full h-full border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors duration-300"
              onClick={generateQR}
            >
              <div className="text-center">
                <QrCode className="w-12 h-12 text-slate-400 mx-auto mb-2" />
                <p className="text-sm text-slate-600">Generate QR</p>
              </div>
            </div>
          )}
        </div>

        {isGenerated && (
          <div className="flex justify-center space-x-3">
            <button
              onClick={downloadQR}
              className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-xl font-semibold 
                       hover:scale-105 active:scale-95 transition-all duration-200
                       shadow-lg hover:shadow-xl hover:shadow-blue-500/25 flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            <button
              className="bg-slate-200 text-slate-700 px-4 py-2 rounded-xl font-semibold 
                       hover:scale-105 active:scale-95 transition-all duration-200
                       hover:bg-slate-300 flex items-center space-x-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        )}

        <div className="mt-4 text-xs text-slate-500">
          <p className="break-all">{url}</p>
        </div>
      </div>
    </div>
  );
};

export default QRCodeComponent;