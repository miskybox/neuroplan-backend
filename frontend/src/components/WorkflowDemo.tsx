import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';
import { Loader2, CheckCircle2, XCircle, AlertCircle, Activity, Zap, Send } from 'lucide-react';
import { workflowService, healthService } from '../services/neuroplanApi';
import { toast } from 'sonner';

export default function WorkflowDemo() {
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  
  // Estado para Trigger Workflow
  const [workflowName, setWorkflowName] = useState('');
  const [workflowData, setWorkflowData] = useState('{}');
  const [isTriggeringWorkflow, setIsTriggeringWorkflow] = useState(false);
  const [workflowResult, setWorkflowResult] = useState<any>(null);
  
  // Estado para Notificaciones PEI
  const [peiIdGenerated, setPeiIdGenerated] = useState('1');
  const [peiIdApproved, setPeiIdApproved] = useState('1');
  const [isNotifyingGenerated, setIsNotifyingGenerated] = useState(false);
  const [isNotifyingApproved, setIsNotifyingApproved] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [approvedResult, setApprovedResult] = useState<any>(null);
  
  // Estado para Estadísticas
  const [stats, setStats] = useState<any>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    setIsCheckingConnection(true);
    try {
      const response = await healthService.check();
      setIsBackendConnected(response.status === 200);
      if (response.status === 200) {
        toast.success('Conectado al backend correctamente');
      }
    } catch (error: any) {
      setIsBackendConnected(false);
      toast.error('No se pudo conectar con el backend');
      console.error('Backend connection error:', error);
    } finally {
      setIsCheckingConnection(false);
    }
  };

  const handleTriggerWorkflow = async () => {
    if (!workflowName.trim()) {
      toast.error('Por favor ingresa el nombre del workflow');
      return;
    }

    let parsedData;
    try {
      parsedData = JSON.parse(workflowData);
    } catch (error: any) {
      toast.error('El JSON de datos no es válido');
      console.error('JSON parse error:', error);
      return;
    }

    setIsTriggeringWorkflow(true);
    setWorkflowResult(null);

    try {
      const response = await workflowService.trigger({
        workflowName,
        data: parsedData,
      });

      if (response.status === 200 || response.status === 201) {
        setWorkflowResult(response.data);
        toast.success(response.message || 'Workflow disparado exitosamente');
      } else {
        toast.error('Error al disparar el workflow');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al disparar el workflow');
      console.error('Error:', error);
    } finally {
      setIsTriggeringWorkflow(false);
    }
  };

  const handleNotifyPEIGenerated = async () => {
    const peiId = parseInt(peiIdGenerated);
    if (isNaN(peiId) || peiId <= 0) {
      toast.error('Por favor ingresa un ID de PEI válido');
      return;
    }

    setIsNotifyingGenerated(true);
    setGeneratedResult(null);

    try {
      const response = await workflowService.notifyPEIGenerated(peiId);

      if (response.status === 200 || response.status === 201) {
        setGeneratedResult(response.data);
        toast.success(response.message || `Notificación enviada: PEI ${peiId} generado`);
      } else {
        toast.error('Error al enviar notificación');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar notificación');
      console.error('Error:', error);
    } finally {
      setIsNotifyingGenerated(false);
    }
  };

  const handleNotifyPEIApproved = async () => {
    const peiId = parseInt(peiIdApproved);
    if (isNaN(peiId) || peiId <= 0) {
      toast.error('Por favor ingresa un ID de PEI válido');
      return;
    }

    setIsNotifyingApproved(true);
    setApprovedResult(null);

    try {
      const response = await workflowService.notifyPEIApproved(peiId);

      if (response.status === 200 || response.status === 201) {
        setApprovedResult(response.data);
        toast.success(response.message || `Notificación enviada: PEI ${peiId} aprobado`);
      } else {
        toast.error('Error al enviar notificación');
      }
    } catch (error: any) {
      toast.error(error.message || 'Error al enviar notificación');
      console.error('Error:', error);
    } finally {
      setIsNotifyingApproved(false);
    }
  };

  const handleLoadStats = async () => {
    setIsLoadingStats(true);
    setStats(null);

    try {
      console.log('Cargando estadísticas...');
      const response = await workflowService.getStats();
      console.log('Respuesta recibida:', response);

      if (response.status === 200) {
        setStats(response.data);
        toast.success('Estadísticas cargadas exitosamente');
      } else {
        toast.error(`Error al cargar estadísticas (${response.status})`);
      }
    } catch (error: any) {
      console.error('Error completo:', error);
      const errorMessage = error.response?.data?.message || error.message || 'Error de conexión';
      toast.error(`Error: ${errorMessage}`);
      
      // Mostrar datos de prueba en caso de error
      setStats({
        total: 0,
        success: 0,
        failed: 0,
        running: 0,
        successRate: 0,
        _note: 'Datos de prueba - Backend no respondió'
      });
    } finally {
      setIsLoadingStats(false);
    }
  };

  const renderResult = (result: any) => {
    if (!result) return null;

    return (
      <div className="mt-4 p-4 bg-muted rounded-lg">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="h-5 w-5 text-green-500" />
          <span className="font-semibold">Resultado:</span>
        </div>
        <pre className="text-sm overflow-auto max-h-96">
          {JSON.stringify(result, null, 2)}
        </pre>
      </div>
    );
  };

  if (isCheckingConnection) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-muted-foreground">Verificando conexión...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Alert variant={isBackendConnected ? 'default' : 'destructive'}>
        <Activity className="h-4 w-4" />
        <AlertDescription>
          {isBackendConnected ? (
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Backend conectado correctamente
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <XCircle className="h-4 w-4" />
              No se pudo conectar con el backend. Verifica que esté corriendo en http://localhost:3001
            </span>
          )}
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            n8n Workflow Automation Demo
          </CardTitle>
          <CardDescription>
            Prueba las funcionalidades de automatización de workflows con n8n
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="trigger" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trigger">Trigger Workflow</TabsTrigger>
              <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
              <TabsTrigger value="stats">Estadísticas</TabsTrigger>
            </TabsList>

            {/* Tab: Trigger Custom Workflow */}
            <TabsContent value="trigger" className="space-y-4">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="workflowName">Nombre del Workflow</Label>
                  <Input
                    id="workflowName"
                    placeholder="ej: send-email-notification"
                    value={workflowName}
                    onChange={(e) => setWorkflowName(e.target.value)}
                    disabled={!isBackendConnected}
                  />
                </div>

                <div>
                  <Label htmlFor="workflowData">Datos (JSON)</Label>
                  <textarea
                    id="workflowData"
                    className="w-full min-h-[150px] px-3 py-2 border rounded-md"
                    placeholder='{"email": "user@example.com", "message": "Hello from neuroplan!"}'
                    value={workflowData}
                    onChange={(e) => setWorkflowData(e.target.value)}
                    disabled={!isBackendConnected}
                  />
                </div>

                <Button
                  onClick={handleTriggerWorkflow}
                  disabled={!isBackendConnected || isTriggeringWorkflow}
                  className="w-full"
                >
                  {isTriggeringWorkflow ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Disparando Workflow...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Disparar Workflow
                    </>
                  )}
                </Button>

                {renderResult(workflowResult)}
              </div>
            </TabsContent>

            {/* Tab: PEI Notifications */}
            <TabsContent value="notifications" className="space-y-6">
              {/* Notify PEI Generated */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-blue-500" />
                  <h3 className="text-lg font-semibold">Notificar PEI Generado</h3>
                </div>
                
                <div>
                  <Label htmlFor="peiIdGenerated">ID del PEI</Label>
                  <Input
                    id="peiIdGenerated"
                    type="number"
                    placeholder="1"
                    value={peiIdGenerated}
                    onChange={(e) => setPeiIdGenerated(e.target.value)}
                    disabled={!isBackendConnected}
                  />
                </div>

                <Button
                  onClick={handleNotifyPEIGenerated}
                  disabled={!isBackendConnected || isNotifyingGenerated}
                  className="w-full"
                  variant="secondary"
                >
                  {isNotifyingGenerated ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando Notificación...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Notificar Generación
                    </>
                  )}
                </Button>

                {renderResult(generatedResult)}
              </div>

              <div className="border-t pt-6" />

              {/* Notify PEI Approved */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <h3 className="text-lg font-semibold">Notificar PEI Aprobado</h3>
                </div>
                
                <div>
                  <Label htmlFor="peiIdApproved">ID del PEI</Label>
                  <Input
                    id="peiIdApproved"
                    type="number"
                    placeholder="1"
                    value={peiIdApproved}
                    onChange={(e) => setPeiIdApproved(e.target.value)}
                    disabled={!isBackendConnected}
                  />
                </div>

                <Button
                  onClick={handleNotifyPEIApproved}
                  disabled={!isBackendConnected || isNotifyingApproved}
                  className="w-full"
                  variant="default"
                >
                  {isNotifyingApproved ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Enviando Notificación...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Notificar Aprobación
                    </>
                  )}
                </Button>

                {renderResult(approvedResult)}
              </div>
            </TabsContent>

            {/* Tab: Statistics */}
            <TabsContent value="stats" className="space-y-4">
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Obtén estadísticas sobre la ejecución de workflows en n8n
                </p>

                <Button
                  onClick={handleLoadStats}
                  disabled={!isBackendConnected || isLoadingStats}
                  className="w-full"
                  variant="outline"
                >
                  {isLoadingStats ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cargando Estadísticas...
                    </>
                  ) : (
                    <>
                      <Activity className="mr-2 h-4 w-4" />
                      Cargar Estadísticas
                    </>
                  )}
                </Button>

                {stats && (
                  <div className="grid gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Estadísticas de n8n</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Workflows:</span>
                            <Badge>{stats.totalWorkflows || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Ejecutados:</span>
                            <Badge variant="secondary">{stats.executedWorkflows || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Exitosos:</span>
                            <Badge variant="default">{stats.successfulExecutions || 0}</Badge>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Fallidos:</span>
                            <Badge variant="destructive">{stats.failedExecutions || 0}</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <div className="mt-4 p-4 bg-muted rounded-lg">
                      <pre className="text-sm overflow-auto max-h-96">
                        {JSON.stringify(stats, null, 2)}
                      </pre>
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
