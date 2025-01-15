import express from "express";
import { 
    sign_in, 
    sign_up, 


} from "../controllers/UserController.js";
import { 
    guardarCliente,
    guardarHabitacion,
    guardarReservacion,
    obtenerClientes,
    obtenerHabitaciones,
    obtenerReservaciones,
    eliminarCliente,
    eliminarHabitacion,
    eliminarReservacion,
    actualizarCliente,
    actualizarHabitacion,
    actualizarReservacion
} from "../controllers/HotelDataController.js";
const router = express.Router();


//user hotel routes
router.post('/hotel/save-client',  guardarCliente);
router.post('/hotel/save-room',  guardarHabitacion);
router.post('/hotel/save-reservation',  guardarReservacion);
router.get('/hotel/get-clients',  obtenerClientes);
router.get('/hotel/get-rooms',  obtenerHabitaciones);
router.get('/hotel/get-reservations',  obtenerReservaciones);
router.delete('/hotel/delete-client/:id',  eliminarCliente);
router.delete('/hotel/delete-room/:id',  eliminarHabitacion);
router.delete('/hotel/delete-reservation/:id',  eliminarReservacion);
router.put('/hotel/update-client/:id',  actualizarCliente);
router.put('/hotel/update-room/:id',  actualizarHabitacion);
router.put('/hotel/update-reservation/:id',  actualizarReservacion);

// user register routes
router.post('/sign-up', sign_up);
router.post('/sign-in', sign_in);

export default router;