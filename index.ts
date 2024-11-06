import express, {Application} from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';
import authRoutes from './routes/authRoutes';
import connectDB from './config/database';
import './config/passport';

dotenv.config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;


app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de establecer `secure: true` en producción con HTTPS
  }));

app.use(express.json());
app.use(passport.initialize());

app.use(passport.session()); // Habilita el soporte de sesión en passport

app.use('/api/auth', authRoutes); // Monta las rutas en /api/auth
app.use('./api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));


//Basic endpoint for testing
app.get('/', (req, res) => {
    res.send('Authentication Microservice');
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));