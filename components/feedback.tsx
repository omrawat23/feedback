'use client'

import React, { useEffect, useRef } from 'react'

// Disable the ESLint rule for this entire block
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      "my-widget": React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        projectid: string;
      };
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

interface FeedbacifyWidgetProps {
  projectId: string;
}

export default function FeedbacifyWidget({ projectId }: FeedbacifyWidgetProps) {
  const widgetRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://feedbacify-widget.vercel.app/widget.umd.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  return (
    <div style={{position: "fixed", bottom: "15px", right: "15px"}}>
      <my-widget
        ref={widgetRef}
        projectid={projectId}
      />
    </div>
  )
}