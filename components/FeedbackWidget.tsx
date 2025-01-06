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
      <script async src="https://feedbacify-widget.vercel.app/widget.umd.js"></script>
    </div>

  );
}