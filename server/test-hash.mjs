import bcrypt from 'bcryptjs';

const hash = '$2a$10$sH6kHvPd9dBE1NykjjF2HeNmJSpHUhZho0zGCO1TnE4HyGGHXnykq';

const passwords = ['admin123', 'staff123', 'cliente123', 'password', '123456', 'staff', 'cliente'];
for (const pwd of passwords) {
  console.log(pwd + ':', bcrypt.compareSync(pwd, hash));
}

const newHash = bcrypt.hashSync('admin123', 10);
console.log('New hash for admin123:', newHash);
