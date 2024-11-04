import express, {Application} from 'express';
import dotenv from 'dotenv';
import passport from 'passport';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './utils/swagger';
import authRoutes from './routes/authRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(passport.initialize());
app.use('./api/auth', authRoutes);
app.use('./api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//Basic endpoint for testing
app.get('/', (req, res) => {
    res.send('Authentication Microservice');
  });

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));