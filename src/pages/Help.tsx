
import React, { useState } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { HelpCircle, Mail, Phone, BookOpen, MessageSquare, Search, Info } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

const Help = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info(`Buscando: ${searchQuery}`);
    // En una implementación real, aquí se realizaría la búsqueda
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) {
      toast.error('Por favor complete todos los campos');
      return;
    }
    toast.success('Mensaje enviado con éxito');
    setEmail('');
    setMessage('');
  };

  const faqItems = [
    {
      question: '¿Cómo puedo crear un reporte?',
      answer: 'Para crear un reporte, haga clic en el botón "Nuevo Reporte" en la parte superior de la pantalla. Complete el formulario con la información requerida, incluida la ubicación, categoría y descripción del problema.'
    },
    {
      question: '¿Cómo puedo ver el estado de mi reporte?',
      answer: 'Puede ver el estado de sus reportes en la sección "Reportes". Allí encontrará una lista de todos sus reportes con su estado actual.'
    },
    {
      question: '¿Puedo editar un reporte después de enviarlo?',
      answer: 'Sí, puede editar un reporte después de enviarlo siempre que aún no haya sido asignado a un técnico para su resolución. Para editar un reporte, vaya a la página de detalles del reporte y haga clic en el botón "Editar".'
    },
    {
      question: '¿Cómo se asignan las prioridades a los reportes?',
      answer: 'Las prioridades se asignan según la urgencia y el impacto del problema. Por ejemplo, un problema que afecta a la seguridad pública tendrá una prioridad alta.'
    },
    {
      question: '¿Cómo puedo usar el mapa para encontrar reportes?',
      answer: 'En la sección "Mapa", puede ver todos los reportes en un mapa interactivo. Puede hacer zoom, desplazarse y hacer clic en los marcadores para ver más detalles sobre cada reporte.'
    }
  ];

  const guideItems = [
    {
      title: 'Guía para crear reportes efectivos',
      content: 'Para crear un reporte efectivo, incluya detalles específicos sobre el problema, como ubicación exacta, cuándo lo notó por primera vez y fotos si es posible. Esto ayudará a los técnicos a entender y resolver el problema más rápidamente.'
    },
    {
      title: 'Cómo usar el mapa interactivo',
      content: 'El mapa interactivo le permite ver todos los reportes en un área. Puede hacer zoom para ver más detalles, filtrar por categoría o estado, y hacer clic en los marcadores para ver más información sobre un reporte específico.'
    },
    {
      title: 'Entendiendo los estados de los reportes',
      content: 'Los reportes pueden tener diferentes estados, como Pendiente, En revisión, En proceso, Resuelto o Cancelado. Cada estado indica la etapa actual en el proceso de resolución del reporte.'
    }
  ];

  return (
    <Layout titulo="Centro de Ayuda">
      <div className="max-w-4xl mx-auto">
        <Alert className="mb-8 bg-blue-50 border-blue-200">
          <Info className="h-4 w-4" />
          <AlertTitle>Centro de Ayuda de GeoReport</AlertTitle>
          <AlertDescription>
            Bienvenido al Centro de Ayuda. Aquí encontrará recursos para utilizar efectivamente nuestra plataforma.
          </AlertDescription>
        </Alert>

        <div className="mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="Buscar en la ayuda..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit">
              <Search className="h-4 w-4 mr-2" />
              Buscar
            </Button>
          </form>
        </div>

        <Tabs defaultValue="faq" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-6">
            <TabsTrigger value="faq">
              <HelpCircle className="h-4 w-4 mr-2" />
              Preguntas Frecuentes
            </TabsTrigger>
            <TabsTrigger value="guides">
              <BookOpen className="h-4 w-4 mr-2" />
              Guías
            </TabsTrigger>
            <TabsTrigger value="contact">
              <MessageSquare className="h-4 w-4 mr-2" />
              Contacto
            </TabsTrigger>
            <TabsTrigger value="about">
              <Info className="h-4 w-4 mr-2" />
              Acerca de
            </TabsTrigger>
          </TabsList>

          <TabsContent value="faq" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preguntas Frecuentes</CardTitle>
                <CardDescription>
                  Respuestas a las preguntas más comunes sobre el uso de la plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {faqItems.map((item, index) => (
                    <AccordionItem key={index} value={`item-${index}`}>
                      <AccordionTrigger>{item.question}</AccordionTrigger>
                      <AccordionContent>
                        <p className="text-gray-600">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Guías de Uso</CardTitle>
                <CardDescription>
                  Guías detalladas para ayudarlo a aprovechar al máximo nuestra plataforma.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {guideItems.map((item, index) => (
                    <div key={index} className="pb-6 border-b last:border-b-0 last:pb-0">
                      <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.content}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contacto</CardTitle>
                <CardDescription>
                  Si tiene alguna pregunta o problema, no dude en contactarnos.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-blue-100">
                        <Mail className="h-4 w-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-gray-500">soporte@georeport.com</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-green-100">
                        <Phone className="h-4 w-4 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">Teléfono</p>
                        <p className="text-sm text-gray-500">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="su-email@ejemplo.com"
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Mensaje
                      </label>
                      <textarea
                        id="message"
                        className="w-full min-h-[120px] px-3 py-2 text-sm rounded-md border border-input bg-background"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="¿En qué podemos ayudarle?"
                      ></textarea>
                    </div>
                    <Button type="submit" className="w-full">Enviar Mensaje</Button>
                  </form>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Acerca de GeoReport</CardTitle>
                <CardDescription>
                  Información sobre nuestra plataforma y misión.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <p>
                    GeoReport es una plataforma de gestión de reportes ciudadanos que permite a los usuarios informar problemas en su comunidad, como baches, fallas en el alumbrado público, acumulación de basura y más.
                  </p>
                  <p>
                    Nuestra misión es facilitar la comunicación entre los ciudadanos y las autoridades locales para mejorar la calidad de vida en las comunidades.
                  </p>
                  <p>
                    La plataforma fue desarrollada en 2025 y ha ayudado a resolver miles de problemas en comunidades de todo el país.
                  </p>
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Características principales:</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Creación de reportes georreferenciados</li>
                      <li>Seguimiento del estado de los reportes</li>
                      <li>Mapa interactivo de problemas reportados</li>
                      <li>Gestión administrativa de reportes</li>
                      <li>Categorización de problemas</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Help;
