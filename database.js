const Database = require('better-sqlite3');
const path = require('path');

const DB_PATH = path.join(__dirname, 'automoveis_gold.db');
let db;

function initDB() {
  db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS veiculos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      marca TEXT NOT NULL,
      modelo TEXT NOT NULL,
      ano INTEGER NOT NULL,
      preco REAL NOT NULL,
      km INTEGER NOT NULL,
      combustivel TEXT NOT NULL,
      tipo TEXT NOT NULL,
      descricao TEXT,
      imagem TEXT,
      destaque INTEGER DEFAULT 0,
      criado_em TEXT DEFAULT (datetime('now'))
    )
  `);

  const count = db.prepare('SELECT COUNT(*) as c FROM veiculos').get();
  if (count.c === 0) seedData();
}

function seedData() {
  const veiculos = [
    {
      nome: 'Ferrari 488 GTB',
      marca: 'Ferrari',
      modelo: '488 GTB',
      ano: 2022,
      preco: 1850000,
      km: 5200,
      combustivel: 'Gasolina',
      tipo: 'Esportivo',
      descricao: 'O Ferrari 488 GTB é uma obra-prima da engenharia italiana. Motor V8 biturbo de 660 cv, aceleração de 0-100 km/h em 3,0 segundos. Exemplar em estado impecável com revisão em dia.',
      imagem: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=800&q=80',
      destaque: 1
    },
    {
      nome: 'Lamborghini Huracán EVO',
      marca: 'Lamborghini',
      modelo: 'Huracán EVO',
      ano: 2023,
      preco: 2350000,
      km: 2100,
      combustivel: 'Gasolina',
      tipo: 'Esportivo',
      descricao: 'Potência e beleza se encontram no Lamborghini Huracán EVO. Motor V10 aspirado de 640 cv, 0-100 km/h em 2,9 s. Tração integral LDVI com inteligência artificial.',
      imagem: 'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80',
      destaque: 1
    },
    {
      nome: 'Porsche 911 Carrera S',
      marca: 'Porsche',
      modelo: '911 Carrera S',
      ano: 2023,
      preco: 980000,
      km: 8400,
      combustivel: 'Gasolina',
      tipo: 'Esportivo',
      descricao: 'O ícone eterno da Porsche. Motor flat-six biturbo de 450 cv, câmbio PDK de 8 marchas. Design atemporal com tecnologia de ponta.',
      imagem: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80',
      destaque: 1
    },
    {
      nome: 'BMW M5 Competition',
      marca: 'BMW',
      modelo: 'M5 Competition',
      ano: 2022,
      preco: 750000,
      km: 15300,
      combustivel: 'Gasolina',
      tipo: 'Sedan',
      descricao: 'O BMW M5 Competition combina luxo e performance extrema. Motor V8 biturbo de 625 cv com tração xDrive. Interior M exclusivo com bancos aquecidos e refrigerados.',
      imagem: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
      destaque: 1
    },
    {
      nome: 'Mercedes-AMG GT 63 S',
      marca: 'Mercedes',
      modelo: 'AMG GT 63 S',
      ano: 2023,
      preco: 1200000,
      km: 3800,
      combustivel: 'Gasolina',
      tipo: 'Esportivo',
      descricao: 'O AMG GT 63 S é o Grand Tourer definitivo da Mercedes. Motor V8 biturbo de 639 cv, câmbio AMG Speedshift MCT de 9 marchas, 0-100 em 3,2 s.',
      imagem: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800&q=80',
      destaque: 1
    },
    {
      nome: 'Bentley Continental GT',
      marca: 'Bentley',
      modelo: 'Continental GT V8',
      ano: 2022,
      preco: 2100000,
      km: 6500,
      combustivel: 'Gasolina',
      tipo: 'Cupê',
      descricao: 'O Bentley Continental GT representa o ápice do luxo britânico. Interior artesanal com madeira e couro selecionados à mão. Motor V8 biturbo de 550 cv.',
      imagem: 'https://images.unsplash.com/photo-1563720223523-2f4ff7c90a53?w=800&q=80',
      destaque: 1
    },
    {
      nome: 'Audi RS7 Sportback',
      marca: 'Audi',
      modelo: 'RS7 Sportback',
      ano: 2022,
      preco: 860000,
      km: 12000,
      combustivel: 'Gasolina',
      tipo: 'Sedan',
      descricao: 'Audi RS7 Sportback — elegância e potência num único carro. Motor V8 biturbo de 600 cv, 0-100 km/h em 3,6 s. Design fastback exclusivo.',
      imagem: 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800&q=80',
      destaque: 0
    },
    {
      nome: 'Range Rover Sport SVR',
      marca: 'Land Rover',
      modelo: 'Range Rover Sport SVR',
      ano: 2023,
      preco: 780000,
      km: 9600,
      combustivel: 'Gasolina',
      tipo: 'SUV',
      descricao: 'Range Rover Sport SVR — o SUV mais potente da Land Rover. Motor V8 de 575 cv, capacidade off-road excepcional e interior premium.',
      imagem: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=80',
      destaque: 0
    },
    {
      nome: 'Tesla Model S Plaid',
      marca: 'Tesla',
      modelo: 'Model S Plaid',
      ano: 2023,
      preco: 650000,
      km: 7800,
      combustivel: 'Elétrico',
      tipo: 'Sedan',
      descricao: 'Tesla Model S Plaid — 0-100 km/h em 2,1 segundos. O sedan elétrico mais rápido do mundo com autonomia de 637 km. Tecnologia Autopilot de última geração.',
      imagem: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80',
      destaque: 0
    },
    {
      nome: 'Porsche Cayenne Turbo GT',
      marca: 'Porsche',
      modelo: 'Cayenne Turbo GT',
      ano: 2023,
      preco: 1150000,
      km: 4200,
      combustivel: 'Gasolina',
      tipo: 'SUV',
      descricao: 'O Cayenne Turbo GT é o SUV mais rápido da Porsche. Motor V8 biturbo de 640 cv, 0-100 km/h em 3,3 s. Suspensão ativa PDCC Sport.',
      imagem: 'https://images.unsplash.com/photo-1608891564052-1f804f7b1f1a?w=800&q=80',
      destaque: 0
    },
    {
      nome: 'Maserati GranTurismo',
      marca: 'Maserati',
      modelo: 'GranTurismo Modena',
      ano: 2023,
      preco: 1450000,
      km: 1800,
      combustivel: 'Gasolina',
      tipo: 'Cupê',
      descricao: 'O novo Maserati GranTurismo Modena. Design italiano deslumbrante com motor V6 Nettuno de 490 cv desenvolvido para a Fórmula 1.',
      imagem: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80',
      destaque: 0
    },
    {
      nome: 'BMW X7 M60i',
      marca: 'BMW',
      modelo: 'X7 M60i',
      ano: 2023,
      preco: 720000,
      km: 11200,
      combustivel: 'Gasolina',
      tipo: 'SUV',
      descricao: 'BMW X7 M60i — o maior SUV da BMW com 7 lugares em configuração luxuosa. Motor V8 biturbo de 530 cv, sistema de suspensão integral ativa.',
      imagem: 'https://images.unsplash.com/photo-1619767886558-efdc259cde1a?w=800&q=80',
      destaque: 0
    }
  ];

  const stmt = db.prepare(`
    INSERT INTO veiculos (nome, marca, modelo, ano, preco, km, combustivel, tipo, descricao, imagem, destaque)
    VALUES (@nome, @marca, @modelo, @ano, @preco, @km, @combustivel, @tipo, @descricao, @imagem, @destaque)
  `);

  const insertMany = db.transaction((items) => {
    for (const item of items) stmt.run(item);
  });

  insertMany(veiculos);
  console.log('Banco de dados inicializado com 12 veículos de exemplo.');
}

function getAll({ tipo, marca, busca, destaque } = {}) {
  let query = 'SELECT * FROM veiculos WHERE 1=1';
  const params = [];

  if (tipo)     { query += ' AND tipo = ?';     params.push(tipo); }
  if (marca)    { query += ' AND marca = ?';    params.push(marca); }
  if (destaque) { query += ' AND destaque = 1'; }
  if (busca) {
    query += ' AND (nome LIKE ? OR marca LIKE ? OR modelo LIKE ?)';
    params.push(`%${busca}%`, `%${busca}%`, `%${busca}%`);
  }

  query += ' ORDER BY destaque DESC, id DESC';
  return db.prepare(query).all(...params);
}

function getById(id) {
  return db.prepare('SELECT * FROM veiculos WHERE id = ?').get(id);
}

function insert(data) {
  const stmt = db.prepare(`
    INSERT INTO veiculos (nome, marca, modelo, ano, preco, km, combustivel, tipo, descricao, imagem, destaque)
    VALUES (@nome, @marca, @modelo, @ano, @preco, @km, @combustivel, @tipo, @descricao, @imagem, @destaque)
  `);
  const result = stmt.run(data);
  return getById(result.lastInsertRowid);
}

function update(id, data) {
  if (!getById(id)) return null;
  db.prepare(`
    UPDATE veiculos SET nome=@nome, marca=@marca, modelo=@modelo, ano=@ano, preco=@preco,
    km=@km, combustivel=@combustivel, tipo=@tipo, descricao=@descricao, imagem=@imagem, destaque=@destaque
    WHERE id=@id
  `).run({ ...data, id });
  return getById(id);
}

function remove(id) {
  if (!getById(id)) return null;
  db.prepare('DELETE FROM veiculos WHERE id = ?').run(id);
  return true;
}

function getMarcas() {
  return db.prepare('SELECT DISTINCT marca FROM veiculos ORDER BY marca').all().map(r => r.marca);
}

function getTipos() {
  return db.prepare('SELECT DISTINCT tipo FROM veiculos ORDER BY tipo').all().map(r => r.tipo);
}

module.exports = { initDB, getAll, getById, insert, update, remove, getMarcas, getTipos };
