import WorkflowDemo from '../components/WorkflowDemo';

export default function WorkflowDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">n8n Workflow Automation</h1>
            <p className="text-lg text-muted-foreground">
              Prueba la integración con n8n para automatizar workflows y notificaciones
            </p>
          </div>

          <WorkflowDemo />
        </div>
      </div>
    </div>
  );
}
