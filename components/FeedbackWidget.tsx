'use client';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      "my-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        "project-id": string | number;
      };
    }
  }
}

import { useEffect, useState } from 'react';

export default function FeedbackWidget({ projectId }: { projectId: string | number }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Set mounted state and load script only on client
    setMounted(true);
    
    const script = document.createElement('script');
    script.src = 'https://feedbacify-widget.vercel.app/widget.umd.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script when component unmounts
      document.body.removeChild(script);
    };
  }, []);

  // Only render the widget on client-side
  if (!mounted) return null;

  return (
    <div style={{ position: "fixed", bottom: "15px", right: "15px" }}>
      <my-widget project-id={projectId} />
    </div>
  );
}