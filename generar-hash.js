const bcrypt = require('bcryptjs');

const generarHash = async () => {
    const hash = await bcrypt.hash('password123', 10);
    console.log('Hash generado:', hash);
};

generarHash();
