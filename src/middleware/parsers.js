import { SESSION_SECRET } from '../constants';
import { Router } from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

const parsers = Router();

parsers.use(cookieParser(SESSION_SECRET));
parsers.use(bodyParser.urlencoded({ extended: false }));
parsers.use(bodyParser.json());

export default parsers;
