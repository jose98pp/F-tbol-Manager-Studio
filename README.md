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

## Persistencia y Almacenamiento en la Nube con Firebase

La aplicación cuenta con **almacenamiento persistente en Firebase Firestore**:

- **Base de datos Firestore Enterprise**: Vinculada a la base de datos `ai-studio-ftbolbannerstudi-c6ffcace-3f68-42ec-9214-ab4d5e6db5b2` en el proyecto `temporal-moon-llxdt`.
- **Colecciones persistentes por usuario** (`/users/{userId}/*`):
  - `savedTemplates`: Plantillas deportivas personalizadas (alineaciones, previas, goles, marcadores).
  - `brandProfiles`: Marcas y canales configurados con logos, colores y cuentas sociales.
  - `publications`: Historial de publicaciones y programación con horario de Bolivia (BOT UTC-4).
  - `media`: Biblioteca de recursos, escudos y fotos personalizadas.
  - `workspace`: Estado actual de edición del lienzo auto-guardado en la nube.
- **Autenticación con Google**: Permite iniciar sesión para sincronizar automáticamente los datos entre múltiples dispositivos y navegadores.
- **Espacio de trabajo completo**: También conserva la geometría de cada capa por tipo de plantilla (posición X/Y, ancho, alto, rotación, opacidad, visibilidad y bloqueo) para recuperar el diseño al volver a iniciar sesión.
- **Modo sin conexión / respaldo local**: Si el usuario no ha iniciado sesión, los datos continúan guardándose localmente y se migran automáticamente a Firestore al iniciar sesión.

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

## Avance del editor profesional y distribución social

La rama de trabajo incluye una primera base para edición de objetos:
- Capas con dimensiones opcionales de ancho y alto.
- Tirador de redimensionamiento con puntero en el lienzo.
- Inspector para posición X/Y, ancho, alto y rotación.
- El modo manual permite copiar el texto preparado; el diseño se exporta desde el editor y se comparte en la aplicación oficial de cada red.
- El modo automático permanece protegido: el endpoint responde como no configurado hasta implementar OAuth y adaptadores oficiales. No se deben mostrar publicaciones simuladas como exitosas.
- El historial inicia vacío para evitar que ejemplos ficticios parezcan publicaciones reales.

### Trabajo pendiente antes de producción

1. Completar redimensionamiento visual consistente para cada tipo de objeto y plantillas; probar ratón, táctil y exportación.
2. Guardar proyectos, medios y plantillas en almacenamiento persistente del servidor, con autenticación y control de acceso.
3. Implementar conexión OAuth real, empezando por Meta (Facebook Pages e Instagram Professional).
4. Crear cola persistente y trabajador de programación con zona horaria America/La_Paz, reintentos idempotentes y registro de respuestas oficiales.
5. Integrar TikTok, YouTube y X según elegibilidad, permisos y revisión de cada plataforma.
6. Añadir pruebas automatizadas y validar compilación antes de desplegar.

**Importante:** esta rama es desarrollo en curso. La publicación automática real todavía no está disponible y requiere credenciales oficiales configuradas en el entorno del servidor; nunca deben guardarse tokens en el frontend ni en el repositorio.

## Persistencia del lienzo (etapa en desarrollo)

- El documento `users/{userId}/workspace/current` conserva los datos de la plantilla activa y `layersByTemplate` para restaurar posiciones, dimensiones y rotaciones de los objetos.
- Las plantillas personalizadas guardan también el mapa de capas por tipo, de modo que al aplicarlas se recupera su composición y no solamente los datos del partido.
- Los documentos antiguos que solo contienen `templateData` siguen siendo compatibles; sus capas comienzan con la geometría predeterminada.
- El autoguardado espera a que termine la restauración inicial para evitar sobrescribir la copia en la nube con el estado vacío del navegador.


## ESPN: alineaciones oficiales

- El explorador consulta `GET /api/espn/summary?league=bol.1&event=EVENT_ID` para recuperar los datos de resumen del partido.
- Cuando ESPN publica los rosters, el modal muestra titulares y suplentes por equipo y permite importar el XI de local o visitante a la plantilla de alineación.
- Los jugadores importados conservan nombre, dorsal, posición y fotografía cuando ESPN la proporciona; también se guardan en el plantel reutilizable del club.
- La disponibilidad depende de la competición y del momento de publicación de ESPN. Si no hay XI oficial, la interfaz lo informa y no inventa jugadores.
- El mapeo de posiciones se adapta a las categorías visuales del editor (POR, DEF, MED y DEL); revisar los datos del proveedor antes de publicar.


## ESPN: estadísticas e incidencias del partido

- El explorador consulta `GET /api/espn/statistics?league=bol.1&event=EVENT_ID` para obtener las estadísticas por equipo desde el resumen oficial de ESPN.
- Muestra el marcador y las métricas que el proveedor entregue (por ejemplo, posesión, remates, remates al arco, córners y faltas), además de incidencias disponibles como goles, tarjetas y sustituciones.
- La respuesta se almacena en caché durante 60 segundos y el endpoint valida liga e identificador de evento y aplica un tiempo máximo de espera.
- La cobertura depende de ESPN y de la competición. Los campos ausentes se omiten; no se generan estadísticas ni incidencias ficticias.
- Antes de publicar un gráfico, contrastar los valores con la ficha oficial del encuentro, especialmente en competiciones con cobertura parcial.
