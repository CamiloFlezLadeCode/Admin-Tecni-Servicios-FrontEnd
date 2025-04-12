import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'tu_host',
  user: 'tu_usuario',
  password: 'tu_contraseña',
  database: 'tu_base_de_datos',
  waitForConnections: true,
  connectionLimit: 10, // Ajusta según tus necesidades
  queueLimit: 0
});

export default pool;

// npm install mysql2
// npm install --save-dev @types/mysql2 // PARA INSTALAR DEPENDENCIAS
