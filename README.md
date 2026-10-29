
# Automatización de facturas DIGI

Proyecto personal desarrollado con Google Apps Script para automatizar la descarga y organización de las facturas mensuales de DIGI desde Gmail a Google Drive.

El objetivo es evitar una tarea manual y repetitiva, guardando las facturas automáticamente y manteniendo los archivos organizados.

## Funcionalidades

- Busca los correos enviados por DIGI en Gmail.
- Identifica el PDF cuyo nombre comienza por `DGF`.
- Guarda la factura en la carpeta `Casa/Digi` de Google Drive.
- Renombra el archivo con el formato `MM_AAAA.pdf` (por ejemplo, `09_2026.pdf`).
- Evita sobrescribir archivos que ya existen.
- Marca como leído el correo que contiene la factura.
- Permite procesar facturas antiguas y automatizar las siguientes mediante un activador.

## Tecnologías

- Google Apps Script
- Gmail
- Google Drive
- JavaScript

## Instalación y configuración

1. Accede a [Google Apps Script](https://script.google.com/) y crea un proyecto.
2. Copia el código de `Code.gs` y guarda los cambios.
3. Crea en Google Drive la carpeta `Casa/Digi`.
4. Ejecuta la función `guardarFacturasDigi` y concede los permisos solicitados por Google.
5. Configura un activador basado en tiempo para ejecutar el script automáticamente.

### Configuración

Los principales parámetros se encuentran en el objeto `CONFIG` de `Code.gs`:

| Parámetro | Descripción |
|---|---|
| `REMITENTE` | Dirección de correo de DIGI. |
| `CARPETA_PRINCIPAL` | Carpeta principal de Drive. |
| `CARPETA_DESTINO` | Carpeta donde se guardan las facturas. |
| `PREFIJO_FACTURA` | Prefijo del PDF que se busca. |

Puedes modificar estos valores para adaptarlos a tu cuenta y a tu estructura de carpetas.

## Funcionamiento

El script busca los correos de DIGI, localiza el PDF correspondiente y genera su nombre utilizando la fecha de recepción del correo.

Antes de guardar el archivo, comprueba si ya existe una factura con el mismo nombre. Si existe, la omite para evitar sobrescribirla.

Se presupone que hay una factura por mes. Si una factura llega con retraso, se utilizará el mes de recepción del correo, no el periodo de facturación indicado dentro del PDF.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para conocer las condiciones de uso.
