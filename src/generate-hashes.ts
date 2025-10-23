import bcrypt from 'bcrypt';

const users = [
  { email: 'admin@demo.com', password: 'Admin123!', role: 'ADMIN' },
  { email: 'orientador@demo.com', password: 'Orientador123!', role: 'ORIENTADOR' },
  { email: 'profesor@demo.com', password: 'Profesor123!', role: 'PROFESOR' },
  { email: 'director@demo.com', password: 'Director123!', role: 'DIRECTOR_CENTRO' },
  { email: 'familia@demo.com', password: 'Familia123!', role: 'FAMILIA' },
];

(async () => {
  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 10);
    console.log(`('${user.email}', '${hash}', '${user.role}')`);
  }
})();
