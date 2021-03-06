import path from 'path';

import express from 'express';
import session from 'express-session';

import passport from 'passport';

import bodyParser from 'body-parser';
import mysql from 'mysql';

import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';

import { 
  algorithm, auth, 
  userstate, report, 
  notice, admin, 
  compile
} from './routes';

const app = express();
const expressPort = 8080;
const webpackPort = 4000;

// Setting
app.use(bodyParser.json());
app.use(function(error, req, res, next){
  console.error('[throw-error]', error.stack);
  return res.status(500).json({
    error: error,
    next: next,
    code: 500,
    msg: "Something broken!!!"
  });
});
app.use(session({
  secret: "dolf@@c(*@_ASD",
  resave: false,
  saveUninitialized: true
}));

// For Facebook login 
app.use(passport.initialize());
app.use(passport.session());

// Router Controll
app.use('/', express.static(path.join(__dirname, './../public')));
app.use('/api/data', algorithm);
app.use('/api/auth', auth);
app.use('/api/userstate', userstate)
app.use('/api/report', report);
app.use('/api/notice', notice);
app.use('/api/admin', admin);
app.use('/api/compile', compile);

app.get('*', (req,res)=>{
  return res.status(200).sendFile(path.join(__dirname, './../public/index.html'));
});

// PRODUCTION
app.listen(expressPort, ()=>{
  console.log('[express] Server is running on port:', expressPort);
});

// DEVELOPMENT
if(process.env.NODE_ENV === 'development'){
  console.log('[express server is running]');
  const config = require('../webpack.dev.config');
  const compiler = webpack(config);
  const devServer = new WebpackDevServer(compiler, config.devServer);
  devServer.listen(webpackPort, ()=>{
    console.log('[webpack-dev] Server is running on port:', webpackPort);
  })
}
