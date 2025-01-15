import { mongoHelper } from "../helpers/MongoHelper.js";
import { ObjectId } from 'mongodb';
import { error_response, custom_response, create_response } from "../helpers/Response.js";

// Funciones para Clientes
export const guardarCliente = async (req, res) => {
    const { cedula, nombre, apellidos, telefono, email } = req.body;
    if (!cedula || !nombre || !apellidos) return error_response('Todos los campos son requeridos!', res);

    try {
        // Verificar si la cédula ya existe
        const existeCedula = await mongoHelper.findOne('clientes', { cedula });
        if (existeCedula) return error_response('Ya existe un cliente con esta cédula', res);

        const clienteData = await mongoHelper.insertOne('clientes', {
            cedula,
            nombre,
            apellidos,
            telefono,
            email,
            createdAt: new Date()
        });

        return custom_response(clienteData,'Cliente registrado correctamente', res);
    } catch (error) {
        console.error('Error al guardar el cliente:', error);
        return error_response(error?.message, res);
    }
};

export const guardarHabitacion = async (req, res) => {
    const { habitacion, descripcion, precio } = req.body;
    if (!habitacion || !precio) return error_response('Todos los campos son requeridos!', res);

    try {
        const habitacionData = await mongoHelper.insertOne('habitaciones', {
            habitacion,
            descripcion,
            precio,
            createdAt: new Date()
        });

        return custom_response(habitacionData, 'Habitación registrada correctamente', res);
    } catch (error) {
        console.error('Error al guardar la habitación:', error);
        return error_response(error?.message, res);
    }
};

export const guardarReservacion = async (req, res) => {
    const { id_habitacion, id_cliente, fechaInicio, fechaFin } = req.body;
    if (!id_habitacion || !id_cliente || !fechaInicio || !fechaFin) {
        return error_response('Todos los campos son requeridos!', res);
    }

    try {
        // Verificar si existe la habitación y el cliente
        const habitacion = await mongoHelper.findOne('habitaciones', { _id: ObjectId.createFromHexString(id_habitacion) });
        const cliente = await mongoHelper.findOne('clientes', { _id: ObjectId.createFromHexString(id_cliente) });

        if (!habitacion || !cliente) {
            return error_response('Habitación o cliente no encontrado', res);
        }

        const reservacionData = await mongoHelper.insertOne('reservaciones', {
            id_habitacion: ObjectId.createFromHexString(id_habitacion),
            id_cliente: ObjectId.createFromHexString(id_cliente),
            fechaInicio: new Date(fechaInicio),
            fechaFin: new Date(fechaFin),
            createdAt: new Date()
        });

        return custom_response( reservacionData, 'Reservación registrada correctamente', res);
    } catch (error) {
        console.error('Error al guardar la reservación:', error);
        return error_response(error?.message, res);
    }
};

export const obtenerClientes = async (req, res) => {
    try {
        const clientes = await mongoHelper.find('clientes', {});
        return custom_response(clientes, 'Clientes obtenidos exitosamente', res);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        return error_response(error?.message, res);
    }
};

export const obtenerHabitaciones = async (req, res) => {
    try {
        const habitaciones = await mongoHelper.find('habitaciones', {});
        return custom_response(habitaciones, 'Habitaciones obtenidas exitosamente', res);
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        return error_response(error?.message, res);
    }
};

export const obtenerReservaciones = async (req, res) => {
    try {
        const reservaciones = await mongoHelper.aggregate('reservaciones', [
            {
                $lookup: {
                    from: 'clientes',
                    localField: 'id_cliente',
                    foreignField: '_id',
                    as: 'cliente'
                }
            },
            {
                $lookup: {
                    from: 'habitaciones',
                    localField: 'id_habitacion',
                    foreignField: '_id',
                    as: 'habitacion'
                }
            },
            {
                $unwind: '$cliente'
            },
            {
                $unwind: '$habitacion'
            },
            {
                $project: {
                    _id: 1,
                    'cliente.cedula': 1,
                    'habitacion.habitacion': 1,
                    fechaInicio: 1,
                    fechaFin: 1
                }
            }
        ]);

        return custom_response(reservaciones, 'Reservaciones obtenidas exitosamente', res);
    } catch (error) {
        console.error('Error al obtener reservaciones:', error);
        return error_response(error?.message, res);
    }
};

export const eliminarCliente = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await mongoHelper.deleteOne('clientes', { 
            _id: ObjectId.createFromHexString(id) // Añadir ObjectId.createFromHexString
        });
        
        if (result.deletedCount === 0) {
            return error_response('Cliente no encontrado', res);
        }
        
        return create_response('Cliente eliminado correctamente', res);
    } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        return error_response(error?.message, res);
    }
};

export const eliminarHabitacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await mongoHelper.deleteOne('habitaciones', { 
            _id: ObjectId.createFromHexString(id) 
        });
        
        if (result.deletedCount === 0) {
            return error_response('Habitación no encontrada', res);
        }
        
        return create_response('Habitación eliminada correctamente', res);
    } catch (error) {
        console.error('Error al eliminar la habitación:', error);
        return error_response(error?.message, res);
    }
};

export const eliminarReservacion = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await mongoHelper.deleteOne('reservaciones', { 
            _id: ObjectId.createFromHexString(id) 
        });
        
        if (result.deletedCount === 0) {
            return error_response('Reservación no encontrada', res);
        }
        
        return create_response('Reservación eliminada correctamente', res);
    } catch (error) {
        console.error('Error al eliminar la reservación:', error);
        return error_response(error?.message, res);
    }
};

export const actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const { cedula, nombre, apellidos, telefono, email } = req.body;

    if (!cedula || !nombre || !apellidos) {
        return error_response('Todos los campos son requeridos', res);
    }

    try {
        // Verificar si el cliente existe
        const clienteExistente = await mongoHelper.findOne('clientes', { 
            _id: ObjectId.createFromHexString(id) // Añadir ObjectId.createFromHexString
        });

        if (!clienteExistente) {
            return error_response('Cliente no encontrado', res);
        }

        // Verificar si la nueva cédula ya existe en otro cliente
        if (clienteExistente.cedula !== cedula) {
            const cedulaExistente = await mongoHelper.findOne('clientes', { 
                cedula,
                _id: { $ne: ObjectId.createFromHexString(id) } // Añadir ObjectId.createFromHexString
            });

            if (cedulaExistente) {
                return error_response('Ya existe un cliente con esta cédula', res);
            }
        }

        const result = await mongoHelper.updateOne(
            'clientes',
            { _id: ObjectId.createFromHexString(id) }, // Añadir ObjectId.createFromHexString
            {
                $set: {
                    cedula,
                    nombre,
                    apellidos,
                    telefono,
                    email,
                    updatedAt: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return error_response('No se realizaron cambios en el cliente', res);
        }

        return create_response('Cliente actualizado correctamente', res);
    } catch (error) {
        console.error('Error al actualizar el cliente:', error);
        return error_response(error?.message, res);
    }
};

export const actualizarHabitacion = async (req, res) => {
    const { id } = req.params;
    const { habitacion, descripcion, precio } = req.body;

    if (!habitacion || !precio) {
        return error_response('Todos los campos son requeridos', res);
    }

    try {
        const result = await mongoHelper.updateOne(
            'habitaciones',
            { _id: ObjectId.createFromHexString(id) },
            {
                $set: {
                    habitacion,
                    descripcion,
                    precio,
                    updatedAt: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return error_response('Habitación no encontrada', res);
        }

        return create_response('Habitación actualizada correctamente', res);
    } catch (error) {
        console.error('Error al actualizar la habitación:', error);
        return error_response(error?.message, res);
    }
};

export const actualizarReservacion = async (req, res) => {
    const { id } = req.params;
    const { id_habitacion, id_cliente, fechaInicio, fechaFin } = req.body;

    if (!id_habitacion || !id_cliente || !fechaInicio || !fechaFin) {
        return error_response('Todos los campos son requeridos', res);
    }

    try {
        // Verificar si existe la habitación y el cliente
        const habitacion = await mongoHelper.findOne('habitaciones', { 
            _id: ObjectId.createFromHexString(id_habitacion) 
        });
        const cliente = await mongoHelper.findOne('clientes', { 
            _id: ObjectId.createFromHexString(id_cliente) 
        });

        if (!habitacion || !cliente) {
            return error_response('Habitación o cliente no encontrado', res);
        }

        const result = await mongoHelper.updateOne(
            'reservaciones',
            { _id: ObjectId.createFromHexString(id) },
            {
                $set: {
                    id_habitacion: ObjectId.createFromHexString(id_habitacion),
                    id_cliente: ObjectId.createFromHexString(id_cliente),
                    fechaInicio: new Date(fechaInicio),
                    fechaFin: new Date(fechaFin),
                    updatedAt: new Date()
                }
            }
        );

        if (result.modifiedCount === 0) {
            return error_response('Reservación no encontrada', res);
        }

        return create_response('Reservación actualizada correctamente', res);
    } catch (error) {
        console.error('Error al actualizar la reservación:', error);
        return error_response(error?.message, res);
    }
};