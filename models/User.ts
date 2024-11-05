import mongoose, { Schema, Document } from 'mongoose';

interface IUser extends Document {
  RFC: string;
  nombre: string;
  CP: string;
  calle: string;
  noexterior: string;
  nointerior: string;
  colonia: string;
  estado: string;
  localidad: string;
  municipio: string;
  telefono: string;
  celular: string;
  email: string;
  sucursal: string;
  area: string;
  tipoUsuario: string;
  client_googleId: string;
  client_secret: string;
  password: string;
}

const UserSchema: Schema = new Schema({
  RFC: { type: String, default: "" },
  nombre: { type: String, default: "" },
  CP: { type: String, default: "" },
  calle: { type: String, default: "" },
  noexterior: { type: String, default: "" },
  nointerior: { type: String, default: "" },
  colonia: { type: String, default: "" },
  estado: { type: String, default: "" },
  localidad: { type: String, default: "" },
  municipio: { type: String, default: "" },
  telefono: { type: String, default: "" },
  celular: { type: String, default: "" },
  email: { type: String, default: "" },
  sucursal: { type: String, default: "" },
  area: { type: String, default: "" },
  tipoUsuario: { type: String, default: "" },
  client_googleId: { type: String, default: "" },
  client_secret: { type: String, default: "" },
  password: { type: String, required: true },
});

export default mongoose.model<IUser>('User', UserSchema);