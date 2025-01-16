import { google } from "googleapis";
import path from "path";
import { promises as fs } from "fs";

export default async function handler(req, res) {
  // Solo permitimos solicitudes POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Solo POST está permitido." });
  }

  const { rut } = req.body;

  // Validar que el RUT no esté vacío
  if (!rut || typeof rut !== "string") {
    return res.status(400).json({ error: "RUT inválido o no proporcionado." });
  }

  try {
    // Leer las credenciales desde el archivo credentials.json
    const credentialsPath = path.join(process.cwd(), "credentials.json");
    const credentials = JSON.parse(await fs.readFile(credentialsPath, "utf-8"));

    // Configurar autenticación con Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
    });

    // Configurar cliente de Google Sheets
    const sheets = google.sheets({ version: "v4", auth });
    const sheetId = "1Avr8TRyijSmcztvgOrbvMswfHQWOZBjhjbt3tQ74HV0"; // Reemplaza con tu ID de Google Sheet

    // Leer datos de la hoja
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "A:E", // Ajusta el rango según tus columnas (A: Nombre, B: RUT, etc.)
    });

    const rows = response.data.values;

    // Filtrar filas que coincidan con el RUT
    const matchingRows = rows.filter((row) => row[1] === rut);

    // Si no se encuentran resultados
    if (matchingRows.length === 0) {
      return res.status(404).json({ error: `No se encontraron datos para el RUT: ${rut}` });
    }

    // Responder con los datos encontrados
    return res.status(200).json({ data: matchingRows });
  } catch (error) {
    console.error("Error al consultar Google Sheets:", error.message);
    return res.status(500).json({ error: "Error interno del servidor. Verifica el archivo credentials.json y la configuración del Google Sheet." });
  }
}