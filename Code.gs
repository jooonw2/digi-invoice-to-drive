/**
 * Automatización de facturas DIGI a Google Drive
 *
 * Busca las facturas de DIGI en Gmail, identifica el PDF
 * correspondiente, lo renombra y lo guarda en una carpeta
 * específica de Google Drive.
 *
 * También marca como leído el correo procesado y evita
 * sobrescribir facturas que ya existen.
 * Licencia: MIT
 */

const CONFIG = {

  // Dirección de correo del remitente de DIGI
  REMITENTE: 'digimobil.no-reply@bulkmail.digimobil.es',

  // Estructura de carpetas de Google Drive
  CARPETA_PRINCIPAL: 'Casa',
  CARPETA_DESTINO: 'Digi',

  // Identificación del archivo adjunto
  PREFIJO_FACTURA: 'DGF',
  EXTENSION_ARCHIVO: '.pdf',

  // Búsqueda de correos en Gmail
  BUSQUEDA_GMAIL: 'from:digimobil.no-reply@bulkmail.digimobil.es',

  // Número de conversaciones procesadas por lote
  TAMANO_LOTE: 100

};


/**
 * Función principal de la automatización.
 *
 * Busca los correos de DIGI, extrae los PDF correspondientes,
 * los renombra y los guarda en Google Drive.
 */
function guardarFacturasDigi() {

  const carpetaDestino = obtenerCarpetaDestino();

  let inicio = 0;
  let guardadas = 0;
  let omitidas = 0;
  let procesados = 0;

  while (true) {

    const conversaciones = GmailApp.search(
      CONFIG.BUSQUEDA_GMAIL,
      inicio,
      CONFIG.TAMANO_LOTE
    );

    if (conversaciones.length === 0) {
      break;
    }

    conversaciones.forEach(conversacion => {

      const mensajes = conversacion.getMessages();

      mensajes.forEach(mensaje => {

        procesados++;

        const adjuntos = mensaje.getAttachments();

        // Buscar el PDF cuyo nombre comienza por DGF.
        const factura = adjuntos.find(adjunto => {

          const nombre = adjunto.getName().toUpperCase();

          return nombre.startsWith(CONFIG.PREFIJO_FACTURA) &&
                 nombre.endsWith(CONFIG.EXTENSION_ARCHIVO.toUpperCase());

        });

        // Si no existe una factura válida, continuar.
        if (!factura) {
          return;
        }

        // Obtener la fecha de recepción del correo.
        const fecha = mensaje.getDate();

        const mes = String(fecha.getMonth() + 1).padStart(2, '0');
        const año = fecha.getFullYear();

        // Generar el nombre: MM_AAAA.pdf
        const nombreNuevo = `${mes}_${año}.pdf`;

        // Comprobar si la factura ya existe en Drive.
        const archivosExistentes = carpetaDestino.getFilesByName(nombreNuevo);

        if (archivosExistentes.hasNext()) {

          Logger.log(`OMITIDA: ${nombreNuevo} ya existe.`);
          omitidas++;

        } else {

          // Guardar el PDF en Google Drive.
          const archivo = carpetaDestino.createFile(factura.copyBlob());

          // Asignar el nuevo nombre.
          archivo.setName(nombreNuevo);

          Logger.log(`GUARDADA: ${nombreNuevo}`);
          guardadas++;

        }

        // Marcar el correo como leído.
        mensaje.markRead();

      });

    });

    inicio += conversaciones.length;

  }

  // Resumen de la ejecución.
  Logger.log('--------------------------------');
  Logger.log('AUTOMATIZACIÓN DIGI FINALIZADA');
  Logger.log(`Mensajes procesados: ${procesados}`);
  Logger.log(`Facturas guardadas: ${guardadas}`);
  Logger.log(`Facturas omitidas: ${omitidas}`);
  Logger.log('--------------------------------');

}


/**
 * Obtiene la carpeta de destino de Google Drive.
 *
 * Ruta esperada:
 * Google Drive / Casa / Digi
 *
 * Si alguna carpeta no existe, se genera un error.
 */
function obtenerCarpetaDestino() {

  const carpetasPrincipales = DriveApp.getFoldersByName(
    CONFIG.CARPETA_PRINCIPAL
  );

  if (!carpetasPrincipales.hasNext()) {
    throw new Error(
      `No se encuentra la carpeta "${CONFIG.CARPETA_PRINCIPAL}".`
    );
  }

  const carpetaPrincipal = carpetasPrincipales.next();

  const carpetasDestino = carpetaPrincipal.getFoldersByName(
    CONFIG.CARPETA_DESTINO
  );

  if (!carpetasDestino.hasNext()) {
    throw new Error(
      `No se encuentra la carpeta "${CONFIG.CARPETA_DESTINO}".`
    );
  }

  return carpetasDestino.next();

}
