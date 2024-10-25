'use client'

import React, { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"

type EmbedType = 'html' | 'react' | 'nextjs';

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
      className="absolute top-2 right-2 p-2 bg-gray-800 dark:bg-black hover:bg-gray-700 dark:hover:bg-gray-900 text-white rounded-md transition-colors duration-200"
      aria-label="Copy to clipboard"
    >
      {copied ? <Check size={18} /> : <Copy size={18} />}
    </button>
  )
}

export default function Page({ params }: { params: { projectId: string } }) {
  const widgetUrl = process.env.NEXT_PUBLIC_WIDGET_URL || 'https://feedbacify-widget.vercel.app'
  const [embedType, setEmbedType] = useState<EmbedType>('html')
  
  const htmlEmbedCode = `<my-widget project-id="${params.projectId}"></my-widget>\n<script src="${widgetUrl}/widget.umd.js"></script>`
  
  const reactEmbedCode = `import React, { useEffect } from 'react';

declare global {
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

interface FeedbacifyWidgetProps {
  projectId: string | number;
}

export default function FeedbacifyWidget({ projectId }: FeedbacifyWidgetProps) {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = '${widgetUrl}/widget.umd.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ position: "fixed", bottom: "15px", right: "15px" }}>
      <my-widget project-id={projectId} />
    </div>
  );
}

// Then use it like this:
<FeedbacifyWidget projectId={${params.projectId}} />
`

  const nextjsEmbedCode = `'use client';

import { useEffect, useState } from 'react';

declare global {
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

interface FeedbacifyWidgetProps {
  projectId: string | number;
}

export default function FeedbacifyWidget({ projectId }: FeedbacifyWidgetProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const script = document.createElement('script');
    script.src = '${widgetUrl}/widget.umd.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ position: "fixed", bottom: "15px", right: "15px" }}>
      <my-widget project-id={projectId} />
    </div>
  );
}

// In your layout.tsx or page:
import dynamic from 'next/dynamic'

const FeedbacifyWidget = dynamic(
  () => import('./FeedbacifyWidget'),
  { ssr: false }
);

// Then use it like this:
<FeedbacifyWidget projectId={${params.projectId}} />
`

  const getEmbedCode = () => {
    switch(embedType) {
      case 'html':
        return htmlEmbedCode;
      case 'react':
        return reactEmbedCode;
      case 'nextjs':
        return nextjsEmbedCode;
      default:
        return htmlEmbedCode;
    }
  }

  const getInstructions = () => {
    switch(embedType) {
      case 'html':
        return (
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Copy the HTML code above.</li>
            <li>Paste it into your website&apos;s HTML, just before the closing &lt;/body&gt; tag.</li>
            <li>The feedback widget will automatically appear on your site.</li>
          </ol>
        );
      case 'react':
        return (
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Copy the React component code above.</li>
            <li>Create a new file in your React project (e.g., FeedbacifyWidget.tsx).</li>
            <li>Paste the copied code into this new file.</li>
            <li>Import and use the FeedbacifyWidget component in your desired location:</li>
            <li className="ml-8">
              <code className="bg-gray-200 dark:bg-gray-900 p-1 rounded">
                {`import FeedbacifyWidget from './FeedbacifyWidget'`}
              </code>
            </li>
            <li className="ml-8">
              <code className="bg-gray-200 dark:bg-gray-900 p-1 rounded">
                {`<FeedbacifyWidget projectId={${params.projectId}} />`}
              </code>
            </li>
          </ol>
        );
      case 'nextjs':
        return (
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Copy the Next.js component code above.</li>
            <li>Create a new file in your Next.js project (e.g., FeedbacifyWidget.tsx).</li>
            <li>Paste the copied code into this new file.</li>
            <li>Import the widget using dynamic import in your layout or page file to prevent hydration errors.</li>
            <li className="ml-8">
              <code className="bg-gray-200 dark:bg-gray-900 p-1 rounded">
                {`const FeedbacifyWidget = dynamic(() => import('./FeedbacifyWidget'), { ssr: false });`}
              </code>
            </li>
            <li className="ml-8">
              <code className="bg-gray-200 dark:bg-gray-900 p-1 rounded">
                {`<FeedbacifyWidget projectId={${params.projectId}} />`}
              </code>
            </li>
          </ol>
        );
    }
  }

  const getNotes = () => {
    switch(embedType) {
      case 'html':
        return "Make sure to test the widget on your site to ensure it's working correctly. If you encounter any issues, please check your console for errors or contact support.";
      case 'react':
        return "This implementation is optimized for standard React applications. The widget script is loaded only once when the component mounts. If you're using TypeScript, the type declarations are included. If you're using JavaScript, you can remove the declare global block.";
      case 'nextjs':
        return "This implementation includes proper client-side only rendering to prevent hydration errors in Next.js. The widget is loaded dynamically with SSR disabled, and the component uses a mounted state to ensure proper client-side rendering. If you encounter any problems, check your browser console for errors or contact our support team.";
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-black shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Start Collecting Feedback</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Embed the code in your site to start gathering valuable insights.</p>
      
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
          React
        </Button>
        <Button
          onClick={() => setEmbedType('nextjs')}
          variant={embedType === 'nextjs' ? 'default' : 'outline'}
        >
          Next.js
        </Button>
      </div>

      <div className="bg-gray-100 dark:bg-gray-900 p-6 rounded-lg relative">
        <pre className="text-gray-800 dark:text-gray-200 text-sm overflow-x-auto">
          <code>{getEmbedCode()}</code>
        </pre>
        <CopyBtn text={getEmbedCode()} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">Instructions:</h2>
        {getInstructions()}
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-900 rounded-lg">
        <p className="text-gray-800 dark:text-gray-200">
          <strong>Note:</strong>{' '}
          {getNotes()}
        </p>
      </div>
    </div>
  )
}