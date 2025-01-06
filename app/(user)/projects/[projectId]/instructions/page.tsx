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

  const reactEmbedCode = `// Option 1: Direct HTML Integration
// Add this in index.html file:
  <my-widget project-id="${params.projectId}"></my-widget>
  <script async src="${widgetUrl}/widget.umd.js"></script>

// Option 2: Reusable Component
// FeedbackWidget.tsx

// TypeScript declarations
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

export default function FeedbackWidget({ projectId }: { projectId: string | number }) {
  return (
    <div>
      <my-widget project-id={projectId} />
      <script async src="${widgetUrl}/widget.umd.js"></script>
    </div>
  );
}

// Usage:
import FeedbackWidget from './FeedbackWidget';

<FeedbackWidget projectId="${params.projectId}" />`

  const nextjsEmbedCode = `// Create a component file
// FeedbackWidget.tsx

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

export default function FeedbackWidget({ projectId }: { projectId: string | number }) {
  return (
    <div>
      <my-widget project-id={projectId} />
      <script async src="${widgetUrl}/widget.umd.js"></script>
    </div>
  );
}

// Using in layout.tsx or any page:
import FeedbackWidget from '../components/FeedbackWidget';

// Add to your layout:
<FeedbackWidget projectId="${params.projectId}" />
`

  const getEmbedCode = () => {
    switch(embedType) {
      case 'html': return htmlEmbedCode;
      case 'react': return reactEmbedCode;
      case 'nextjs': return nextjsEmbedCode;
      default: return htmlEmbedCode;
    }
  }

  const getInstructions = () => {
    switch(embedType) {
      case 'html':
        return (
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Copy the code above</li>
            <li>Paste before closing &lt;/body&gt; tag</li>
          </ol>
        );
      case 'react':
        return (
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Choose an integration method:
              <ul className="list-disc ml-8 space-y-2">
                <li><strong>Basic:</strong> Copy HTML directly into index.html file before closing &lt;/body&gt; tag</li>
                <li><strong>Component:</strong>
                  <ol className="list-decimal ml-8">
                    <li>Create FeedbackWidget.tsx</li>
                    <li>Add TypeScript declarations (if using TS)</li>
                    <li>Import and use where needed</li>
                  </ol>
                </li>
              </ul>
            </li>
          </ol>
        );
      case 'nextjs':
        return (
          <ol className="list-decimal list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Project Setup:
              <ul className="list-disc ml-8">
                <li>Create a component(FeedbackWidget.tsx) file</li>
              </ul>
            </li>
            <li>Copy component code with declarations</li>
            <li>Integration:
              <ul className="list-disc ml-8">
                <li>Add to layout.tsx or page.tsx</li>
              </ul>
            </li>
          </ol>
        );
    }
  }

  const getNotes = () => {
    switch(embedType) {
      case 'html': return "Verify the widget appears on your site after implementation.";
      case 'react': return "Basic integration is quickest. Component approach offers better reusability and TypeScript support.";
      case 'nextjs': return "Works in both pages and app directory.";
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-black shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white">Start Collecting Feedback</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">Embed the code in your site to start gathering valuable insights.</p>

      <div className="flex space-x-4 mb-4">
        <Button onClick={() => setEmbedType('html')} variant={embedType === 'html' ? 'default' : 'outline'}>HTML</Button>
        <Button onClick={() => setEmbedType('react')} variant={embedType === 'react' ? 'default' : 'outline'}>React</Button>
        <Button onClick={() => setEmbedType('nextjs')} variant={embedType === 'nextjs' ? 'default' : 'outline'}>Next.js</Button>
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