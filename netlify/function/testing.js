import bcrypt from 'bcrypt';

const hash = '$2b$10$H2mEwM5D1DpfXILICEeCEOfeeJ6KEONL4UjQpQQn80OhKwYqs/rzi';
const candidate = 'hunter2'; // the password you want to test

const ok = await bcrypt.compare(candidate, hash);
console.log(ok ? 'match' : 'no match');