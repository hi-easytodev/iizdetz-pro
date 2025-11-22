'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface ExportPDFButtonProps {
  ideaId: number;
  ideaTitle: string;
  variant?: 'primary' | 'secondary';
  className?: string;
}

export function ExportPDFButton({
  ideaId,
  ideaTitle,
  variant = 'secondary',
  className = '',
}: ExportPDFButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExport = async () => {
    setIsExporting(true);
    setError(null);

    try {
      const response = await fetch(`/api/export/pdf/${ideaId}`);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to export PDF');
      }

      // Get the PDF blob
      const blob = await response.blob();

      // Create a download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${ideaTitle.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_analysis.pdf`;
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('[Export PDF] Error:', err);
      setError(err instanceof Error ? err.message : 'Failed to export PDF');
    } finally {
      setIsExporting(false);
    }
  };

  const isPrimary = variant === 'primary';

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={isExporting}
        className={`
          flex items-center gap-2 px-4 py-2 rounded-lg font-medium
          transition-all duration-200
          ${
            isPrimary
              ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl'
              : 'bg-[var(--card-bg)] text-[var(--text-primary)] border-2 border-[var(--border-color)] hover:border-purple-500'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
      >
        {isExporting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Generating PDF...</span>
          </>
        ) : (
          <>
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </>
        )}
      </button>

      {error && (
        <p className="mt-2 text-sm text-red-500">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}
