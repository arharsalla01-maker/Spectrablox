# 🎮 Spectrablox Bot - Sistema Completo de Discord

Bot completo de Discord para el servidor Spectrablox con sistema de tickets, roles, midleman y página web integrada.

## ✨ Características

### 🎯 Sistema de Trade Secure (!tradesecure)
- **Trade Elgringo**: Sistema de trades seguro con el equipo del servidor
- **Solicitar Midleman**: Obtén ayuda para trades con otros usuarios
- Sistema de rangos: MM BAJO, MM MEDIO, MM ALTO
- Tickets con sistema de reclamo por rangos
- Feedback automático después de completar trades

### 🛡️ Sistema de Soporte (!soporte)
- **Trade Secure**: Redirección al canal correspondiente
- **Reportar Estafa**: Sistema de reportes
- **Reclamar Premio**: Con validación de ID de Roblox
- **Quiero Roles**: Redirección al canal de roles
- **Alianzas**: Sistema de solicitudes de alianza
- **Otros**: Soporte general

### 👑 Sistema de Roles (!roles)
- **Rol REAL**: Se obtiene automáticamente al iniciar sesión en la web
- **Rol HELPER**: Sistema de entrevistas y plazas limitadas
- **Rol MIDLEMAN**: Sistema de fianzas y rangos
- Comando `/plazas` para gestionar plazas de Helper

### 🌐 Página Web
- Diseño estilo Borsiis con colores negro y dorado
- Login con Discord OAuth2
- Otorgamiento automático del rol REAL
- Muro de trades con brainrots
- Sistema de subida de imágenes
- Diseño responsive y moderno

## 📋 Requisitos Previos

- Node.js 18.x o superior
- MongoDB (local o en la nube)
- Cuenta de Discord Developer
- Token de bot de Discord
- Railway (para despliegue opcional)

## 🚀 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/arharsalla01-maker/Spectrablox.git
cd Spectrablox
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar Variables de Entorno

Copia el archivo `.env.example` a `.env` y configura las variables:

```bash
cp .env.example .env
```

Edita `.env` con tus valores:

```env
# Discord Bot Configuration
DISCORD_TOKEN=your_discord_bot_token_here
CLIENT_ID=your_client_id_here
GUILD_ID=your_guild_id_here

# Discord OAuth2 Configuration
DISCORD_CLIENT_ID=your_discord_client_id_here
DISCORD_CLIENT_SECRET=your_discord_client_secret_here
DISCORD_REDIRECT_URI=http://localhost:3000/auth/discord/callback
DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback

# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/spectrablox

# Railway Variables
MIDLEMAN_CHANNEL_ID=your_midleman_channel_id_here
ROLES_CHANNEL_ID=your_roles_channel_id_here
PROOFS_CHANNEL_ID=your_proofs_channel_id_here

# Role IDs
REAL_ROLE_ID=your_real_role_id_here
HELPER_ROLE_ID=your_helper_role_id_here
MM_BAJO_ROLE_ID=your_mm_bajo_role_id_here
MM_MEDIO_ROLE_ID=your_mm_medio_role_id_here
MM_ALTO_ROLE_ID=your_mm_alto_role_id_here
MOD_ROLE_ID=your_mod_role_id_here
ADMIN_ROLE_ID=your_admin_role_id_here
OWNER_ROLE_ID=your_owner_role_id_here

# Web Configuration
WEB_PORT=3000
SESSION_SECRET=your_session_secret_here

# Brainrot Configuration
BRAINROT_IMAGE_URL=https://cdn.discordapp.com/attachments/1470128567391224043/1474417196456349706/2EC218AD-AFED-4A33-9D87-1BC640B30A0D.png?ex=6999c584&is=69987404&hm=d431aa55ab1ecbecd622e268fb70db24f14969779b32dcee47219fd6682956f8&
```

### 4. Configurar Discord Bot

1. Ve a [Discord Developer Portal](https://discord.com/developers/applications)
2. Crea una nueva aplicación
3. Ve a la sección "Bot" y crea un bot
4. Copia el token y ponlo en `DISCORD_TOKEN`
5. Ve a "OAuth2" → "URL Generator"
6. Selecciona los scopes necesarios:
   - bot
   - applications.commands
7. Selecciona los permisos del bot:
   - Administrator (recomendado para facilitar la configuración)
8. Copia el Client ID y ponlo en `CLIENT_ID`
9. Invita el bot a tu servidor usando la URL generada

### 5. Configurar OAuth2 para la Web

1. En el Discord Developer Portal, ve a "OAuth2" → "General"
2. Copia el Client ID y Client Secret
3. Añade la URL de redirección:
   - Local: `http://localhost:3000/auth/discord/callback`
   - Producción: `https://tu-dominio.com/auth/discord/callback`
4. Configura los scopes:
   - identify
   - guilds.join

### 6. Crear Categorías y Canales en Discord

Crea las siguientes categorías en tu servidor:

- `tickets` - Para tickets de Trade Elgringo
- `tickets-temporales` - Para tickets temporales de midleman
- `midleman-tickets` - Para tickets finales de midleman
- `soporte-tickets` - Para tickets de soporte
- `helper-applications` - Para solicitudes de Helper
- `midleman-applications` - Para solicitudes de Midleman

Canales necesarios:
- `#midleman` - Para el sistema de Trade Secure
- `#roles` - Para el sistema de roles
- `#proofs` - Para guardar los proofs de trades

### 7. Obtener IDs de Roles y Canales

Usa el modo de desarrollador de Discord para obtener los IDs:
1. Configuración de Usuario → Avanzado → Modo desarrollador
2. Click derecho en el rol/canal → Copiar ID

Pon estos IDs en las variables correspondientes del `.env`.

## 🎮 Uso

### Iniciar el Bot

```bash
npm start
```

### Iniciar la Web (en otra terminal)

```bash
npm run web
```

### Comandos Disponibles

- `!tradesecure` - Abre el menú de Trade Secure
- `!soporte` - Abre el menú de soporte
- `!roles` - Abre el menú de roles
- `/plazas añadir <cantidad>` - Añade plazas de Helper
- `/plazas quitar <cantidad>` - Quita plazas de Helper
- `/plazas ver` - Ver plazas disponibles

## 🌐 Despliegue en Railway

### 1. Preparar el Repositorio

Asegúrate de que todo esté commiteado:

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Crear Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Crea un nuevo proyecto
3. Conecta tu repositorio de GitHub
4. Railway detectará automáticamente el proyecto Node.js

### 3. Configurar Variables de Entorno en Railway

1. Ve a la pestaña "Variables"
2. Añade todas las variables del archivo `.env`
3. Asegúrate de actualizar las URLs de redirección para producción

### 4. Configurar MongoDB en Railway

1. Añade un servicio de MongoDB en Railway
2. Copia la URI de conexión
3. Actualiza `MONGODB_URI` en las variables

### 5. Desplegar

Railway desplegará automáticamente tu proyecto. Espera a que el despliegue termine.

## 📁 Estructura del Proyecto

```
Spectrablox/
├── commands/           # Comandos slash del bot
├── handlers/           # Manejadores de eventos
├── buttons/            # Manejadores de botones
├── modals/             # Manejadores de modales
├── selectMenus/        # Manejadores de menús desplegables
├── models/             # Modelos de MongoDB
├── utils/              # Utilidades
├── web/                # Servidor web
├── public/             # Archivos estáticos de la web
│   ├── css/
│   ├── js/
│   └── images/
├── index.js            # Archivo principal del bot
├── package.json        # Dependencias
├── .env.example        # Ejemplo de variables de entorno
└── README.md           # Este archivo
```

## 🔧 Configuración de Roles

### Permisos Necesarios

**Para Trade Elgringo:**
- Reclamar: mod, admin, owner
- Cerrar: todos
- Fui estafado: todos
- Trade completado: solo el creador

**Para Midleman:**
- MM BAJO: rol MM BAJO + owner
- MM MEDIO: rol MM MEDIO + owner
- MM ALTO: rol MM ALTO + owner

**Para Soporte:**
- Reclamar: helper, mod, admin, owner

**Para Roles:**
- Aceptar/Rechazar Helper: admin, owner
- Dar Rol Midleman: admin, owner

## 🐛 Solución de Problemas

### El bot no responde a los comandos
- Verifica que el token sea correcto
- Asegúrate de que el bot tenga los permisos necesarios
- Revisa la consola para errores

### La web no carga
- Verifica que MongoDB esté corriendo
- Revisa las variables de entorno
- Asegúrate de que el puerto esté disponible

### Los roles no se otorgan
- Verifica que los IDs de roles sean correctos
- Asegúrate de que el bot tenga permisos para gestionar roles
- Revisa la configuración de OAuth2

## 📝 Notas Importantes

- El bot requiere Node.js 18.x o superior
- MongoDB debe estar corriendo antes de iniciar el bot
- Asegúrate de configurar correctamente los IDs de roles y canales
- La web requiere HTTPS en producción para OAuth2
- Los tickets se cierran automáticamente después de 3 segundos al completarse

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor, abre un issue o pull request para cualquier mejora.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 👥 Soporte

Si necesitas ayuda, únete al servidor de Discord de Spectrablox o abre un issue en GitHub.

---

**Desarrollado con ❤️ para Spectrablox - ELGRINGO**