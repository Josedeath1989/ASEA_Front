import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*', // En producción, especificar el dominio del frontend
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Endpoint de salud
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Servidor de ACEA SAS funcionando correctamente.' });
});

// Endpoint para recibir las solicitudes de contacto / cotización
app.post('/api/contact', (req, res) => {
  const { empresa, nombre, telefono, servicio } = req.body;

  // Validación básica de campos requeridos
  if (!empresa || !nombre || !telefono || !servicio) {
    return res.status(400).json({
      success: false,
      message: 'Todos los campos (empresa, nombre, teléfono y servicio) son obligatorios.'
    });
  }

  // Simulación de procesamiento (guardar en BD, enviar correo con Nodemailer, etc.)
  console.log('--- NUEVA SOLICITUD TÉCNICA RECIBIDA ---');
  console.log(`🏢 Empresa: ${empresa}`);
  console.log(`👤 Solicitante: ${nombre}`);
  console.log(`📞 Teléfono: ${telefono}`);
  console.log(`🛠️ Servicio: ${servicio}`);
  console.log(`⏰ Fecha/Hora: ${new Date().toISOString()}`);
  console.log('----------------------------------------');

  // Respuesta exitosa
  return res.status(200).json({
    success: true,
    message: '¡Solicitud técnica recibida con éxito! Un consultor se pondrá en contacto en menos de 24 horas.',
    data: { empresa, nombre, telefono, servicio, recibidoEl: new Date() }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor backend de ACEA SAS corriendo en http://localhost:${PORT}`);
});
