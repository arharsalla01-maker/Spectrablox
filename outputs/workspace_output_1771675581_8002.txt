# Plan de Desarrollo - Bot Spectrablox

## [x] Configuración Inicial
- [x] Crear estructura del proyecto
- [x] Configurar archivos de dependencias (package.json)
- [x] Crear archivo .env.example con variables necesarias
- [x] Configurar estructura de carpetas

## [x] Sistema de Menú Midleman (!tradesecure)
- [x] Crear comando !tradesecure con botón inicial y embed
- [x] Implementar menú desplegable con opciones
- [x] Crear flujo TRADE ELGRINGO:
  - [x] Ticket de normas con botones Acepto/No acepto
  - [x] Ticket final con botones (reclamar, cerrar, fui estafado, trade completado)
  - [x] Sistema de ID de Roblox y validación
  - [x] Modal de feedback y envío a canal de proofs
- [x] Crear flujo SOLICITAR MIDLEMAN:
  - [x] Embed informativo con botones aceptar/rechazar
  - [x] Selección de usuario del servidor
  - [x] Modal para detalles del trade
  - [x] Selección de rango (MM BAJO, MM MEDIO, MM ALTO)
  - [x] Ticket temporal de confirmación
  - [x] Ticket final con sistema de reclamo por rangos

## [x] Sistema de Menú Soporte (!soporte)
- [x] Crear comando !soporte con botón inicial y embed
- [x] Implementar menú desplegable con opciones
- [x] Crear tickets para cada opción:
  - [x] TRADE SECURE (redirección)
  - [x] REPORTAR ESTAFA
  - [x] RECLAMAR PREMIO (con modal de ID Roblox)
  - [x] QUIERO ROLES (redirección)
  - [x] ALIANZAS
  - [x] OTROS
- [x] Implementar sistema de reclamo para helpers, mods, admin, owner

## [x] Sistema de Menú Roles (!roles)
- [x] Crear comando !roles con botón inicial y embed
- [x] Implementar flujo ROL REAL:
  - [x] Integración con web de Discord login
  - [x] Sistema de detección de login y otorgamiento de rol
- [x] Implementar flujo ROL HELPER:
  - [x] Sistema de verificación de plazas disponibles
  - [x] Sistema de entrevista con preguntas
  - [x] Generación de embed con respuestas
  - [x] Botones de Aceptar/Rechazar para admins/owners
- [x] Implementar flujo ROL MIDLEMAN:
  - [x] Ticket de fianza con preguntas
  - [x] Sistema de espera de fianza
  - [x] Botones Dar Rol/Cancelar para admin/owner
- [x] Crear comando para añadir/quitar plazas

## [x] Desarrollo de la Página Web
- [x] Crear estructura HTML/CSS estilo Borsiis
- [x] Implementar diseño oscuro con colores negro y dorado
- [x] Integrar Discord OAuth2 login
- [x] Crear sistema de otorgamiento automático de rol REAL
- [x] Implementar muro de tradeos con brainrots
- [x] Personalizar logos con Spectrablox/ELGRINGO
- [x] Configurar base de datos para guardar brainrots

## [x] Configuración y Despliegue
- [x] Crear README con instrucciones
- [x] Configurar Railway variables
- [x] Crear scripts de despliegue
- [ ] Subir todo al repositorio GitHub
- [ ] Verificar funcionalidad completa

## [x] Documentación Final
- [x] Crear guía de instalación
- [x] Documentar comandos y variables
- [x] Crear tutorial de uso