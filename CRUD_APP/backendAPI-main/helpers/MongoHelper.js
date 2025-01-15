
import fetch from 'node-fetch';
import { client } from '../config/db.js'; 

export const mongoHelper = {
    // Encontrar documentos
    find: async (collection, query = {}, options = {}) => {
        try {
            const db = client.db();
            return await db.collection(collection).find(query, options).toArray();
        } catch (error) {
            throw error;
        }
    },

    // Encontrar un solo documento
    findOne: async (collection, query = {}, options = {}) => {
        try {
            const db = client.db();
            return await db.collection(collection).findOne(query, options);
        } catch (error) {
            throw error;
        }
    },

    // Insertar un documento
    insertOne: async (collection, document) => {
        try {
            const db = client.db();
            return await db.collection(collection).insertOne(document);
        } catch (error) {
            throw error;
        }
    },

    // Insertar múltiples documentos
    insertMany: async (collection, documents) => {
        try {
            const db = client.db();
            return await db.collection(collection).insertMany(documents);
        } catch (error) {
            throw error;
        }
    },

    // Actualizar un documento
    updateOne: async (collection, filter, update, options = {}) => {
        try {
            const db = client.db();
            return await db.collection(collection).updateOne(filter, update, options);
        } catch (error) {
            throw error;
        }
    },

    // Actualizar múltiples documentos
    updateMany: async (collection, filter, update, options = {}) => {
        try {
            const db = client.db();
            return await db.collection(collection).updateMany(filter, update, options);
        } catch (error) {
            throw error;
        }
    },

    // Eliminar un documento
    deleteOne: async (collection, filter) => {
        try {
            const db = client.db();
            return await db.collection(collection).deleteOne(filter);
        } catch (error) {
            throw error;
        }
    },

    // Eliminar múltiples documentos
    deleteMany: async (collection, filter) => {
        try {
            const db = client.db();
            return await db.collection(collection).deleteMany(filter);
        } catch (error) {
            throw error;
        }
    },

    // Ejecutar agregaciones
    aggregate: async (collection, pipeline) => {
        try {
            const db = client.db();
            return await db.collection(collection).aggregate(pipeline).toArray();
        } catch (error) {
            throw error;
        }
    }
};
