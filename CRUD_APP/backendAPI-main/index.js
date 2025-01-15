import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
dotenv.config();
import { connectDB } from './config/db.js';     
import router from "./routes/User.js";

const app = express();

// Configurar CORS con opciones específicas
app.use(cors({
    origin: [
        'http://localhost',     // Frontend en nginx
        'http://localhost:80',  // Frontend alternativo
        'http://localhost:4200', // Angular desarrollo
        'http://frontend',      // Nombre del servicio en docker
        '*'                     // Temporalmente permitir todo para debug
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

// Función para intentar conectar a MongoDB con reintentos
const connectWithRetry = async () => {
    const maxRetries = 5;
    let currentTry = 1;

    while (currentTry <= maxRetries) {
        try {
            await connectDB();
            console.log('Database connected successfully');
            return true;
        } catch (error) {
            console.error(`Database connection attempt ${currentTry} failed:`, error);
            if (currentTry === maxRetries) {
                console.error('Max retries reached. Exiting...');
                process.exit(1);
            }
            console.log(`Retrying in 5 seconds...`);
            await new Promise(resolve => setTimeout(resolve, 5000));
            currentTry++;
        }
    }
};

// Iniciar conexión a la base de datos
connectWithRetry();

// Middleware para archivos estáticos
app.use(express.static('public'));
app.use("/uploads", express.static("uploads"));

// Middleware para parsear JSON y form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    createParentPath: true
}));

// Middleware de logging para debugging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Rutas
app.use('/api/user', router); // Removí el slash extra al final

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: false,
        message: 'Something broke!',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 page not found error handling middleware
app.use("*", (req, res) => {
    res.status(404).json({ 
        status: false, 
        message: "API endpoint not found!" 
    });
});

// Iniciar servidor
const port = process.env.PORT || 3000;
app.listen(port, '0.0.0.0', () => {
    console.log('Server running on port 3000');
  });

// Manejo de errores no capturados
process.on('unhandledRejection', (err) => {
    console.log('UNHANDLED REJECTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});

process.on('uncaughtException', (err) => {
    console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
    console.error(err);
    process.exit(1);
});