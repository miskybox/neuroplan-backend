import pool from './db';

async function getAllUsers() {
  const result = await pool.query('SELECT * FROM "User"');
  return result.rows;
}

// Ejemplo de uso
(async () => {
  try {
    const users = await getAllUsers();
    console.log(users);
  } catch (err) {
    console.error('Error al consultar usuarios:', err);
  } finally {
    await pool.end();
  }
})();
