# Fútbol Manager Studio

Estudio gráfico para crear piezas visuales de fútbol y preparar contenido para redes sociales.

## Stack actual

- React 19 + TypeScript
- Vite 8
- Express 4
- Tailwind CSS 4
- Gemini API para asistencia de redacción
- `html-to-image` para exportación gráfica

## Requisitos

- Node.js compatible con Vite 8
- npm o Bun
- Clave de Gemini opcional para las funciones de IA

## Desarrollo local

```bash
npm install
cp .env.example .env
# Configurar GEMINI_API_KEY en .env si se usarán las funciones IA
npm run dev
```

## Compilar y ejecutar

```bash
npm run lint
npm run build
NODE_ENV=production npm start
```

El servidor Express sirve los archivos compilados desde `dist/`.

## Funciones presentes

- Editor de banners para previa, partido, resultado, alineación, gol y tabla.
- Capas gráficas movibles y personalizables.
- Perfiles de marca.
- Biblioteca de recursos y carga local de imágenes.
- Plantillas personalizadas.
- Exportación PNG/JPEG y varios formatos.
- Generación asistida de textos y hashtags para redes sociales.

## Persistencia: limitación actual

Las plantillas personalizadas, recursos subidos e historial de publicaciones se guardan actualmente en `localStorage`. Esto significa que:

- Los datos pertenecen al navegador y dispositivo donde se crearon.
- No se sincronizan entre usuarios o dispositivos.
- Borrar los datos del navegador puede eliminarlos.
- Las imágenes cargadas como datos locales pueden agotar la cuota de almacenamiento del navegador.

Para producción se recomienda incorporar autenticación, base de datos y almacenamiento de objetos (por ejemplo, S3 compatible).

## Publicación en redes: estado y seguridad

**La publicación real todavía no está integrada.** El endpoint `POST /api/social/publish` responde actualmente con HTTP 501 (`SOCIAL_PUBLISHING_NOT_CONFIGURED`) para evitar mostrar publicaciones ficticias como exitosas.

No se deben registrar publicaciones como realizadas ni mostrar enlaces de posts hasta recibir confirmación de la API oficial de cada plataforma.

Integraciones que requieren implementación y credenciales propias:

- **Facebook e Instagram:** Meta Graph API, aplicación Meta, OAuth, permisos y cuenta de Instagram profesional vinculada a una página.
- **TikTok:** Content Posting API, OAuth y aprobación/permisos de publicación correspondientes.
- **YouTube:** YouTube Data API v3 y OAuth para el canal que publicará.
- **X:** API de X y credenciales con permisos de escritura.

Las claves y tokens deben permanecer exclusivamente en el backend, almacenados como variables de entorno o secretos del proveedor de hosting. Nunca incluirlos en React, en el repositorio ni en el bundle del navegador.

La programación real necesitará una cola de trabajos persistente, un worker y estados por plataforma (pendiente, procesando, publicado, fallido), además de reintentos idempotentes.

## Prioridades recomendadas antes de producción

1. Añadir autenticación y autorización para proteger el editor y sus APIs.
2. Sustituir el almacenamiento local por persistencia en servidor y almacenamiento de archivos.
3. Restringir CORS y validar destinos del proxy de imágenes para evitar solicitudes a hosts no confiables.
4. Implementar OAuth oficial por plataforma y guardar tokens cifrados en el servidor.
5. Implementar cola de publicaciones y programación con zona horaria explícita (Bolivia, UTC-4).
6. Añadir pruebas automatizadas para exportación, guardado, OAuth y respuestas parciales de publicación.

## Variables de entorno

Ver `.env.example`. No subir nunca un archivo `.env` real.
