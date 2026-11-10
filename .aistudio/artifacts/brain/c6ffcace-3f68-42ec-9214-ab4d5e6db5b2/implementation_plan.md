# Integración de API ESPN & Gestor de Escudos en Firebase Firestore

Integración de la API oficial de ESPN para consultar partidos en tiempo real, calendarios, marcadores y escudos oficiales de ligas de todo el mundo (Bolivia, CONMEBOL, UEFA, Premier, LaLiga, selecciones y más), permitiendo cargar cualquier partido en las plantillas del editor con un solo clic, junto con un sistema de respaldo en Firebase Firestore para registrar y reutilizar equipos o escudos personalizados que no figuren en ESPN.

## Decisiones Confirmadas del Usuario

> [!IMPORTANT]
> - **Alcance de Ligas**: Todas las ligas del mundo con selector por país/torneo y calendario por fecha (`YYYY-MM-DD`).
> - **Experiencia en el Editor**: Explorador interactivo de partidos en vivo y fechas para previsualizar y transferir con 1 clic a cualquier plantilla (`versus`, `fixture`, `lineup`, `goal`, `result`).
> - **Respaldo de Equipos y Escudos**: Cuando un equipo o escudo no esté en ESPN, el usuario podrá subir o enlazar el escudo y guardarlo permanentemente en **Firebase Firestore** para tenerlo disponible siempre en su biblioteca.

---

## 1. Visión General & Concepto

El nuevo módulo **"Explorador ESPN & Datos en Vivo"** conecta el editor con las fuentes de datos deportivas de ESPN a través de un proxy backend en Express, garantizando acceso instantáneo a:
- Nombres oficiales, abreviaturas y escudos vectoriales/HD de clubes de todo el mundo.
- Marcadores en tiempo real, minutos jugados, estado del partido (*Previa*, *En Vivo*, *Finalizado*) y estadios.
- Asignación automática a la plantilla activa (Partido/Versus, Marcador/Resultado, ¡Gol!, 11 Titular o Cartelera Fixture) sin necesidad de escribir nombres ni buscar logos manualmente.
- Gestor integrado para añadir equipos alternativos (equipos locales bolivianos de asociaciones regionales, torneos barriales o ligas menores) y guardarlos en la colección `/users/{userId}/customClubs` de Firebase Firestore.

---

## 2. Experiencia de Usuario & Diseño Visual

### Flujo Principal de Trabajo

1. **Acceso Rápido desde la Barra Superior y el Editor**:
   - Botón **"Partidos ESPN"** con icono de radar/pelota en la cabecera principal y en la pestaña de Partido/Fixture.
2. **Modal Explorador de Partidos ESPN**:
   - **Barra de filtros**: Selector de fecha rápida (*Hoy*, *Ayer*, *Mañana*, o selector de fecha de calendario) y selector de Liga/País (categorizado: *Bolivia Primera División*, *Copa Libertadores*, *Copa Sudamericana*, *Champions League*, *LaLiga*, *Premier League*, *Serie A*, *Eliminatorias / Selecciones*, etc.).
   - **Buscador en vivo**: Filtro por texto en tiempo real para encontrar rápidamente cualquier equipo o partido.
   - **Tarjetas de Partidos**:
     - Escudos oficiales en alta resolución provistos por el CDN de ESPN.
     - Estado del cotejo (*En Vivo*, *17:30 BOT*, *Finalizado 2 - 1*).
     - Botón de acción **"Cargar en Banner"** con menú desplegable para elegir plantilla destino (*Partido Previa*, *Resultado Final*, *¡Gol!*, o *Añadir a Fixture*).
3. **Manejo de Equipos sin Coincidencia / Creación Personalizada**:
   - Si un equipo no tiene escudo o no existe en la base de datos de ESPN, aparece el botón **"Guardar Equipo Personalizado"**.
   - Permite ingresar el nombre del club, ciudad/país, y subir su imagen o pegar la URL de su escudo.
   - Se guarda directamente en Firebase Firestore y se incorpora automáticamente a la lista de escudos disponibles en el selector de clubes (`ClubPickerModal`) y la biblioteca de recursos.

---

## 3. Decisiones de Producto & Arquitectura

| Decisión | Enfoque Seleccionado | Justificación |
|---|---|---|
| **Consumo de API ESPN** | Proxy en servidor Express (`/api/espn/scoreboard`) | Evita bloqueos de CORS del navegador, normaliza respuestas JSON complejas de ESPN y añade caché en memoria (60s) para maximizar velocidad. |
| **Persistencia de Equipos Personalizados** | Colección `/users/{userId}/customClubs` en Firebase Firestore | Sincronización multi-dispositivo con reglas de seguridad estrictas por usuario, manteniendo compatibilidad con el selector de clubes. |
| **Carga en Plantillas** | Adaptador inteligente que rellena `singleMatch`, `goal`, `fixtureMatches` y actualiza automáticamente los escudos | El creador de contenido ahorra más del 90% del tiempo de armado de banners deportivos. |

---

## 4. Arquitectura Técnica & Diagrama de Flujo

```
┌────────────────────────────────────────────────────────────────────────┐
│                        FRONTEND (React + Vite)                         │
├────────────────────────────────────────────────────────────────────────┤
│  Top Header / Editor Panels                                            │
│        │ (Click "Partidos ESPN")                                       │
│        ▼                                                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                    EspnMatchExplorerModal                        │  │
│  │  - Selector de Ligas (Bolivia, CONMEBOL, UEFA, Premier, etc.)    │  │
│  │  - Selector de Fecha (con zona horaria Bolivia BOT UTC-4)        │  │
│  │  - Buscador en tiempo real de clubes y partidos                  │  │
│  │  - Botón "Cargar en Banner" -> Aplica a TemplateData             │  │
│  │  - Botón "Guardar en Firestore" si el equipo es personalizado    │  │
│  └─────────────────────────────────┬────────────────────────────────┘  │
└────────────────────────────────────┼───────────────────────────────────┘
                                     │ fetch('/api/espn/scoreboard?league=...&date=...')
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        BACKEND (Express en Node.js)                    │
├────────────────────────────────────────────────────────────────────────┤
│  /api/espn/leagues     -> Lista categorizada de torneos                │
│  /api/espn/scoreboard  -> Consulta a site.api.espn.com + Caché 60s    │
└────────────────────────────────────┬───────────────────────────────────┘
                                     │
                                     ▼
┌────────────────────────────────────────────────────────────────────────┐
│                 FIREBASE FIRESTORE & ESTADO PERSISTENTE                │
├────────────────────────────────────────────────────────────────────────┤
│  /users/{userId}/customClubs/{clubId}                                  │
│  - id, name, shortName, crestUrl, city, country, userId, createdAt     │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Plan de Ejecución por Pasos

1. **Endpoints de API ESPN en el Backend (`server.ts`)**:
   - Crear `/api/espn/leagues` con el catálogo de torneos organizados por región (Bolivia, Sudamérica, Europa, Concacaf, Selecciones).
   - Crear `/api/espn/scoreboard` con soporte para parámetros `league` y `date` (`YYYYMMDD`), normalizando los datos de competidores, escudos oficiales de alta resolución, hora/minuto y tanteador.

2. **Extensión del Modelo de Datos y Reglas de Firebase (`firebase-blueprint.json` y `firestore.rules`)**:
   - Añadir la entidad `CustomClub` a `firebase-blueprint.json` y autorizar la subcolección `/users/{userId}/customClubs/{clubId}` en `firestore.rules`.
   - Desplegar las reglas con `DeployRules`.

3. **Capa de Servicio de Equipos Personalizados (`src/lib/firestoreService.ts` & `FirebaseContext.tsx`)**:
   - Funciones para guardar, eliminar y suscribirse en tiempo real a los clubes personalizados del usuario.
   - Integración con el catálogo `CLUBS` para que aparezcan en todos los selectores de escudos.

4. **Componente `EspnMatchExplorerModal.tsx`**:
   - Interfaz con selector de fecha, selector de ligas del mundo, estado de partidos (*En Vivo*, *Previa*, *Final*) y botón de carga rápida al lienzo.
   - Modal o formulario desplegable **"Crear y Guardar Equipo en Firebase"** para subir escudos cuando no existan en la API.

5. **Integración en `App.tsx` y Paneles de Edición**:
   - Botón directo en la barra superior y dentro de los editores de Partido, Fixture y Marcador.
   - Verificación de tipos con `lint_applet` y compilación completa con `compile_applet`.
