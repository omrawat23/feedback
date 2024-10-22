'use client'

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"

const CopyBtn = ({ text }: { text: string }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors duration-200"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  )
}

export default function Page({ params }: { params: { projectId: string } }) {
  const widgetUrl = process.env.NEXT_PUBLIC_WIDGET_URL || 'https://feedbacify-widget.vercel.app'
  const [embedType, setEmbedType] = useState<'html' | 'react'>('html')
  
  const htmlEmbedCode = `<my-widget project-id="${params.projectId}"></my-widget>\n<script src="${widgetUrl}/widget.umd.js"></script>`
  
  const reactEmbedCode = `import React, { useEffect, useRef } from 'react'

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
`

  const embedCode = embedType === 'html' ? htmlEmbedCode : reactEmbedCode

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-900">Start Collecting Feedback</h1>
      <p className="text-lg text-gray-600 mb-6">Embed the code in your site to start gathering valuable insights.</p>
      
      <div className="flex space-x-4 mb-4">
        <Button
          onClick={() => setEmbedType('html')}
          variant={embedType === 'html' ? 'default' : 'outline'}
        >
          HTML
        </Button>
        <Button
          onClick={() => setEmbedType('react')}
          variant={embedType === 'react' ? 'default' : 'outline'}
        >
          React/Next.js
        </Button>
      </div>

      <div className="bg-gray-100 p-6 rounded-lg relative">
        <pre className="text-gray-800 text-sm overflow-x-auto">
          <code>{embedCode}</code>
        </pre>
        <CopyBtn text={embedCode} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900">Instructions:</h2>
        {embedType === 'html' ? (
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Copy the HTML code above.</li>
            <li>Paste it into your website&apos;s HTML, just before the closing &lt;/body&gt; tag.</li>
            <li>The feedback widget will automatically appear on your site.</li>
          </ol>
        ) : (
          <ol className="list-decimal list-inside text-gray-700 space-y-2">
            <li>Copy the React component code above.</li>
            <li>Create a new file in your React/Next.js project (e.g., FeedbacifyWidget.tsx).</li>
            <li>Paste the copied code into this new file.</li>
            <li>Import and use the FeedbacifyWidget component in your desired location (e.g., layout.tsx)</li>
            <li className="ml-8">
              <code className="bg-gray-200 p-1 rounded">
                import FeedbacifyWidget from &apos;./FeedbacifyWidget&apos;
              </code>
            </li>
            <li className="ml-8">
              <code className="bg-gray-200 p-1 rounded">
              {`<FeedbacifyWidget projectId={${params.projectId}} />`}
              </code>
            </li>
          </ol>
        )}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-800">
          <strong>Note:</strong>{' '}
          {embedType === 'html' ? (
            <p>
              Make sure to test the widget on your site to ensure its working correctly. If you encounter any issues, please check your console for errors or contact support.
            </p>
          ) : (
            <p>
              This code includes TypeScript declarations for the custom element. If youre using JavaScript, you can remove the <code>declare global</code> block. The widget script is loaded dynamically to avoid issues with server-side rendering. If you encounter any problems, check your browser console for errors or contact our support team.
            </p>
          )}
        </p>
      </div>
    </div>
  )
}