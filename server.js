// CASI CASI CASIIII
// import express from 'express';
// import next from 'next';

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Aquí puedes definir rutas personalizadas si es necesario
//   server.get('/auth/sign-in', (req, res) => {
//     return app.render(req, res, '/auth/sign-in', req.query);
//   });

//   // Manejar todas las demás solicitudes con Next.js
// //   server.all('*', (req, res) => {
// //     return handle(req, res);
// //   });

//   const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
//   server.listen(PORT, (err) => {
//     if (err) throw err;
//     console.log(`> Listo en http://localhost:${PORT}`);
//   });
// });


// NUEVA OPCIÓN
// import express from 'express';
// import next from 'next';
// import path from 'path';

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Servir archivos estáticos desde una carpeta específica
//   server.use('/static', express.static(path.join(__dirname, '_next/static/chunks/webpack.js?v=1744332319899')));

//   // Ruta personalizada
//   server.get('/auth/sign-in', (req, res) => {
//     return app.render(req, res, '/auth/sign-in', req.query);
//   });

//   // Manejar todas las demás solicitudes con Next.js
// //   server.all('*', (req, res) => {
// //     return handle(req, res);
// //   });

//   const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
//   server.listen(PORT, (err) => {
//     if (err) throw err;
//     console.log(`> Listo en http://localhost:${PORT}/auth/sign-in`);
//   });
// });

// ========================================================================
// import express from 'express';
// import next from 'next';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Obtener el directorio actual
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Servir archivos estáticos desde una carpeta específica
//   server.use('/static', express.static(path.join(__dirname, '_next/static/chunks/')));

//   // Ruta personalizada
//   server.get('/auth/sign-in', (req, res) => {
//     return app.render(req, res, '/auth/sign-in', req.query);
//   });

//   // Manejar todas las demás solicitudes con Next.js
// //   server.all('*', (req, res) => {
// //     return handle(req, res);
// //   });

//   const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
//   server.listen(PORT, (err) => {
//     if (err) throw err;
//     console.log(`> Listo en http://localhost:${PORT}/auth/sign-in`);
//   });
// });


// _____________________________________________________________________________________________________--
// import express from 'express';
// import next from 'next';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Obtener el directorio actual
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Servir archivos estáticos desde la carpeta _next
//   server.use('/_next', express.static(path.join(__dirname, '.next')));

//   // Ruta personalizada
//   server.get('/auth/sign-in', (req, res) => {
//     return app.render(req, res, '/auth/sign-in', req.query);
//   });

//   // Manejar todas las demás solicitudes con Next.js
// //   server.all('*', (req, res) => {
// //     return handle(req, res);
// //   });

//   const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
//   server.listen(PORT, (err) => {
//     if (err) throw err;
//     console.log(`> Listo en http://localhost:${PORT}/auth/sign-in`);
//   });
// });




// VAMOSSS MORRR
// import express from 'express';
// import next from 'next';
// import path from 'path';
// import { fileURLToPath } from 'url';

// // Obtener el directorio actual
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const dev = process.env.NODE_ENV !== 'production';
// const app = next({ dev });
// const handle = app.getRequestHandler();

// app.prepare().then(() => {
//   const server = express();

//   // Servir archivos estáticos de Next.js
//   server.use('/_next', express.static(path.join(__dirname, '.next')));

//   // Servir archivos estáticos desde la carpeta public
//   server.use('/static', express.static(path.join(__dirname, 'public')));

//   // Rutas personalizadas
//   server.get('/auth/sign-in', (req, res) => {
//     return app.render(req, res, '/auth/sign-in', req.query);
//   });

//   server.get('/layout', (req, res) => {
//     return app.render(req, res, '/layout', req.query);
//   });

//   server.get('/not-found', (req, res) => {
//     return app.render(req, res, '/not-found', req.query);
//   });

//   server.get('/dashboard/page', (req, res) => {
//     return app.render(req, res, '/dashboard/page', req.query);
//   });

//   server.get('/dashboard/layout', (req, res) => {
//     return app.render(req, res, '/dashboard/layout', req.query);
//   });

//   // Manejar todas las demás solicitudes con Next.js
// //   server.all('*', (req, res) => {
// //     return handle(req, res);
// //   });

//   const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
//   server.listen(PORT, (err) => {
//     if (err) throw err;
//     console.log(`> Listo en http://localhost:${PORT}/auth/sign-in`);
//   });
// });
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

import express from 'express';
import next from 'next';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Servir archivos estáticos de Next.js
  server.use('/_next', express.static(path.join(__dirname, '.next')));

  // Servir archivos estáticos desde la carpeta public
  server.use('/static', express.static(path.join(__dirname, 'public')));

  // Rutas personalizadas
  server.get('/auth/sign-in', (req, res) => {
    return app.render(req, res, '/auth/sign-in', req.query);
  });

  
  server.get('/dashboard/customers', (req, res) => {
    return app.render(req, res, '/dashboard/customers', req.query);
  });
  

  server.get('/dashboard/integrations', (req, res) => {
    return app.render(req, res, '/dashboard/integrations', req.query);
  });

  
  server.get('/dashboard/account', (req, res) => {
    return app.render(req, res, '/dashboard/account', req.query);
  });

  server.get('/', (req, res) => {
    return app.render(req, res, '/', req.query);
  });


  
  server.get('/errors/not-found', (req, res) => {
    return app.render(req, res, '/errors/not-found', req.query);
  });

  
  server.get('/dashboard/settings', (req, res) => {
    return app.render(req, res, '/dashboard/settings', req.query);
  });
//   server.get('/layout', (req, res) => {
//     return app.render(req, res, '/layout', req.query);
//   });

//   server.get('/not-found', (req, res) => {
//     return app.render(req, res, '/not-found', req.query);
//   });

//   server.get('/dashboard/page', (req, res) => {
//     return app.render(req, res, '/dashboard/page', req.query);
//   });
server.get('/dashboard', (req, res) => {
    return app.render(req, res, '/dashboard', req.query)
});

//   server.get('/dashboard/layout', (req, res) => {
//     return app.render(req, res, '/dashboard/layout', req.query);
//   });

  // Manejar todas las demás solicitudes con Next.js
//   server.all('*', (req, res) => {
//     return handle(req, res);
//   });

  const PORT = process.env.PORT || 3000; // Cambia el puerto si es necesario
  server.listen(PORT, (err) => {
    if (err) throw err;
    console.log(`> Listo en http://localhost:${PORT}/auth/sign-in`);
  });
});
