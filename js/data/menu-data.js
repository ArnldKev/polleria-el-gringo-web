// Datos editables de la carta. Modifica aqui nombres, precios y descripciones.
// Cada plato usa su propia foto: assets/images/products/nombre-del-plato.jpg
// Puedes cambiar esa ruta o su extension en la propiedad image de cada producto.

const categories = [
  'Todos',
  'Pollos a la Brasa',
  'Combos',
  'Combinados',
  'Chaufas',
  'Saltados',
  'Salchipapas y Mas',
  'Sopas',
  'Especiales',
  'Bebidas',
];

function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}


const products = [
  ['Chaufa de Pollo', 11, 'Chaufas', 'Arroz salteado al wok con pollo y el toque de la casa.','assets/images/products/chaufa-de-pollo.png' ],
  ['Chaufa de Carne',15,'Chaufas','Arroz al wok, carne y verduras frescas.','assets/images/products/chaufa-de-carne.png'],
  ['Chaufa de Chancho',15,'Chaufas','Chaufa con chancho dorado y cebolla china.','assets/images/products/chaufa-de-chancho.png'],
  ['Chaufa Salvaje',15,'Chaufas','Una combinacion intensa de sabores al wok.', 'assets/images/products/chaufa-salvaje.png'],
  ['Chaufa Especial',16,'Chaufas','Nuestro chaufa con extra sabor y abundancia., ','assets/images/products/chaufa-especial.png'],
  ['Aeropuerto',13,'Chaufas','Chaufa y fideos salteados en una sola porcion.', 'assets/images/products/aeropuerto.png'],
  ['Salchipapa',10,'Salchipapas y Mas','Papas crocantes, salchicha y cremas.', 'assets/images/products/salchipapa.png'],
  ['Salchipapa Especial',12,'Salchipapas y Mas','La clasica con un toque extra de sabor.', 'assets/images/products/salchipapa-especial.png'],
  ['Salchichaufa',13,'Salchipapas y Mas','Chaufa con salchicha dorada al wok.', 'assets/images/products/salchichaufa.png'],
  ['Salchichaufa Especial',14,'Salchipapas y Mas','Version especial, bien servida y sabrosa.', 'assets/images/products/salchichaufa-especial.png'],
  ['Salchibrasa Especial 1/8',14,'Salchipapas y Mas','Contiene chaufa, pollo a la brasa, salchichas y cremas.', 'assets/images/products/salchibrasa-especial-1-8.png'],
  ['Salchibrasa Especial 1/4',18,'Salchipapas y Mas','Contiene chaufa, pollo a la brasa, salchichas y cremas.', 'assets/images/products/salchibrasa-especial-1-4.png'],
  ['Salchibroster Especial 1/8',14,'Salchipapas y Mas','Contiene chaufa, broaster, salchichas y cremas.', 'assets/images/products/salchibroaster-especial-1-8.png'],
  ['Salchibroster Especial 1/4',18,'Salchipapas y Mas','Contiene chaufa, broaster, salchichas y cremas.', 'assets/images/products/salchibroaster-especial-1-4.png'],
  ['Caldo de Gallina con Presa',12,'Sopas','Caldo reconfortante, gallina y mucho sabor.', 'assets/images/products/caldo-de-gallina-con-presa.png'],
  ['Caldo de Gallina con Huevo',8,'Sopas','Caldito casero con huevo y hierbas.', 'assets/images/products/caldo-de-gallina-con-huevo.png'],
  ['Saltado de Pollo',13,'Saltados','Pollo, cebolla y tomate salteados al fuego.', 'assets/images/products/saltado-de-pollo.png'],
  ['Lomo Saltado',14,'Saltados','Carne salteada al wok con su juguito especial.', 'assets/images/products/lomo-saltado.png'],
  ['Tallarín Saltado de Pollo',13,'Saltados','Tallarines y pollo al wok.', 'assets/images/products/tallarin-saltado-de-pollo.png'],
  ['Tallarín Saltado de Carne',14,'Saltados','Tallarines con carne y verduras salteadas.', 'assets/images/products/tallarin-saltado-de-carne.png'],
  ['Alitas Acevichadas',17,'Especiales','Alitas crocantes bañadas en salsa acevichada.', 'assets/images/products/alitas-acevichadas.png'],
  ['Alitas BBQ',16,'Especiales','Alitas doradas con salsa BBQ.', 'assets/images/products/alitas-bbq.png'],
  ['Alitas Mixtas',22,'Especiales','Alitas crocantes con salsa BBQ y acevichadas.', 'assets/images/products/alitas-mixtas.png'],
  ['1/8 de Pollo a la Brasa',9,'Pollos a la Brasa','Con papas fritas y ensalada fresca.', 'assets/images/products/octavo-de-pollo-a-la-brasa.png'],
  ['1/4 de Pollo a la Brasa',16,'Pollos a la Brasa','Con papas fritas y ensalada fresca.', 'assets/images/products/cuarto-de-pollo-a-la-brasa.png'],
  ['1/2 Pollo a la Brasa',35,'Pollos a la Brasa','Ideal para compartir, con sus guarniciones.', 'assets/images/products/medio-pollo-a-la-brasa.png'],
  ['Pollo Entero a la Brasa',68,'Pollos a la Brasa','El clasico completo para la mesa.', 'assets/images/products/pollo-entero-a-la-brasa.png'],
  ['Monstrito 1/8',13,'Combos','Chaufa, papas y 1/8 de pollo.','assets/images/products/monstrito-1-8.png'],
  ['Monstrito 1/4',17,'Combos','Chaufa, papas y 1/4 de pollo.', 'assets/images/products/monstrito-1-4.png'],
  ['Pollo a lo Pobre 1/8',15,'Combos','Pollo, huevo, platano y papas.', 'assets/images/products/pollo-a-lo-pobre-1-8.png'],
  ['Pollo a lo Pobre 1/4',18,'Combos','Pollo, huevo, platano y papas.', 'assets/images/products/pollo-a-lo-pobre-1-4.png'],
  ['Broaster 1/8',12,'Combos','Pollo broaster con papas y cremas.', 'assets/images/products/broaster-1-8.png'],
  ['Broaster 1/4',16,'Combos','Porcion broaster bien crocante.', 'assets/images/products/broaster-1-4.png'],
  ['Alitas Broaster',10,'Combos','Alitas crocantes para picar.', 'assets/images/products/alitas-broaster.png'],
  ['Lomo con aeropuerto',22,'Combinados','Lomo saltado con aeropuerto.', 'assets/images/products/lomo-con-aeropuerto.png'],
  ['Lomo con chaufa',19,'Combinados','Lomo saltado con chaufa.', 'assets/images/products/lomo-con-chaufa.png'],
  ['Pollo con verduras y chaufa',18,'Combinados','Pollo a la brasa con verduras y chaufa.', 'assets/images/products/pollo-con-verduras-y-chaufa.png'],
  ['Gaseosa 500 ml',4,'Bebidas','Coca Cola, Inca Kola, Sprite o Fanta.', 'assets/images/products/gaseosa-500-ml.png'],
  ['Coca Cola Personal 380 ml',3.5,'Bebidas','Bien helada para acompanar.', 'assets/images/products/coca-cola-personal-380-ml.png'],
  ['Inca Kola Personal 350 ml',3.5,'Bebidas','El sabor del Peru.', 'assets/images/products/inca-kola-personal-350-ml.png'],
  ['Gordita',5,'Bebidas','Gaseosa helada en presentacion gordita.', 'assets/images/products/gordita.png'],
  ['Gaseosa 1 L',7,'Bebidas','Inca Kola, Coca Cola o Guarana.', 'assets/images/products/gaseosa-1l.png'],
  ['Gaseosa 1.5 L',10,'Bebidas','Inca Kola, Coca Cola o Guarana.', 'assets/images/products/gaseosa-1.5l.png'],
  ['Chicha Morada Vaso',4,'Bebidas','Chicha morada refrescante de la casa.', 'assets/images/products/chicha-morada-vaso.png'],
  ['Chicha Morada Jarra 1 L',10,'Bebidas','Jarra para compartir.', 'assets/images/products/chicha-morada-jarra1l.png'],
  ['Agua Mineral 500 ml',2.5,'Bebidas','Agua mineral sin gas.', 'assets/images/products/agua-mineral-500ml.png'],
  ['Guarana',4,'Bebidas','Personal; consulta por 1 L y 1.5 L.', 'assets/images/products/guarana.png'],
  ['Inca Kola 3 L',15,'Bebidas','Presentacion familiar de Inka Kola.', 'assets/images/products/inCa-kola3l.png'],
  ['Coca Cola 3 L',15,'Bebidas','Presentacion familiar de Coca Cola.', 'assets/images/products/coca-cola3l.png'],
].map(([name, price, category, description, image], id) => ({
  id,
  name,
  price,
  category,
  description,
  image,
}));
