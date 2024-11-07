import express, {Application} from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import session from 'express-session';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';
import authRoutes from './routes/authRoutes';
import companyRoutes from './routes/companyRoutes';
import emailRoutes from './routes/emailRoutes';
import connectDB from './config/database';
import './config/passport';
import cors from 'cors';

dotenv.config();
connectDB();

const app: Application = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

app.use(session({
    secret: process.env.SESSION_SECRET || 'your_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Asegúrate de establecer `secure: true` en producción con HTTPS
  }));

app.use(express.json());
app.use(passport.initialize());

app.use(passport.session());

app.use('/api', emailRoutes);
app.use('/api/auth', authRoutes);
app.use('./api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/api', companyRoutes);

//Basic endpoint for testing
app.get('/', (req, res) => {
    res.send('Authentication Microservice');
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));