import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import compression from 'compression';

// Routes
import indexRoutes from './routes/index.routes.js';
import userRoutes from './routes/user.routes.js';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(morgan('dev'));
app.use(helmet());
app.use(compression());

app.use('/', indexRoutes);
app.use('/api/users', userRoutes);

export default app;