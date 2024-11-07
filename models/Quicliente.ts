import mongoose, { Schema, Document } from 'mongoose';

interface IQuicliente extends Document {
  cliente: string;
  nombre: string;
  rfc: string;
  cp: string;
  domicilio: string;
  telefonos: string;
  representante: string;
  email: string;
  IP: string;
  usuariomaster: string;
  passmaster: string;
  putilidad: number;
  Fecha_alta: Date;
}

const QuiclienteSchema: Schema = new Schema({
  cliente: {
    type: String,
    required: true,
    lowercase: true
  },
  nombre: {
    type: String,
    default: ""
  },
  rfc: {
    type: String,
    default: ""
  },
  cp: {
    type: String,
    default: ""
  },
  domicilio: {
    type: String,
    default: ""
  },
  telefonos: {
    type: String,
    default: ""
  },
  representante: {
    type: String,
    default: ""
  },
  email: {
    type: String,
    default: ""
  },
  IP: {
    type: String,
    default: ""
  },
  usuariomaster: {
    type: String,
    default: ""
  },
  passmaster: {
    type: String,
    default: ""
  },
  putilidad: {
    type: Number,
    default: 0
  },
  Fecha_alta: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default mongoose.model<IQuicliente>('Quicliente', QuiclienteSchema);
