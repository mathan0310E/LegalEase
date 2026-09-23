import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  className?: string;
}

export const LegalDisclaimerBanner: React.FC<Props> = ({ className = '' }) => {
  return (
    <div className={`bg-amber-950/40 border border-amber-500/30 rounded-lg p-3.5 flex items-start space-x-3 text-amber-200/90 text-xs ${className}`}>
      <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
      <div>
        <span className="font-semibold text-amber-300">Legal Safety Notice: </span>
        LegalEase provides AI-generated document drafts for informational and drafting purposes. These documents do not constitute legal advice and should be reviewed by a qualified legal professional before execution or formal use.
      </div>
    </div>
  );
};
