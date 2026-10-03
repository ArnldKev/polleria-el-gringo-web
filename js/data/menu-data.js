// Datos editables de la carta. Modifica aqui nombres, precios y descripciones.
// Cada plato usa su propia foto JPG optimizada de la carpeta de productos.
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
  ['Chaufa de Pollo', 11, 'Chaufas', 'Arroz salteado al wok con pollo y el toque de la casa.','assets/images/products/chaufa-de-pollo.jpg' ],
  ['Chaufa de Carne',15,'Chaufas','Arroz al wok, carne y verduras frescas.','assets/images/products/chaufa-de-carne.jpg'],
  ['Chaufa de Chancho',15,'Chaufas','Chaufa con chancho dorado y cebolla china.','assets/images/products/chaufa-de-chancho.jpg'],
  ['Chaufa Salvaje',15,'Chaufas','Una combinacion intensa de sabores al wok.', 'assets/images/products/chaufa-salvaje.jpg'],
  ['Chaufa Especial',16,'Chaufas','Nuestro chaufa con extra sabor y abundancia., ','assets/images/products/chaufa-especial.jpg'],
  ['Aeropuerto',13,'Chaufas','Chaufa y fideos salteados en una sola porcion.', 'assets/images/products/aeropuerto.jpg'],
  ['Salchipapa',10,'Salchipapas y Mas','Papas crocantes, salchicha y cremas.', 'assets/images/products/salchipapa.jpg'],
  ['Salchipapa Especial',12,'Salchipapas y Mas','La clasica con un toque extra de sabor.', 'assets/images/products/salchipapa-especial.jpg'],
  ['Salchichaufa',13,'Salchipapas y Mas','Chaufa con salchicha dorada al wok.', 'assets/images/products/salchichaufa.jpg'],
  ['Salchichaufa Especial',14,'Salchipapas y Mas','Version especial, bien servida y sabrosa.', 'assets/images/products/salchichaufa-especial.jpg'],
  ['Salchibrasa Especial 1/8',14,'Salchipapas y Mas','Contiene chaufa, pollo a la brasa, salchichas y cremas.', 'assets/images/products/salchibrasa-especial-1-8.jpg'],
  ['Salchibrasa Especial 1/4',18,'Salchipapas y Mas','Contiene chaufa, pollo a la brasa, salchichas y cremas.', 'assets/images/products/salchibrasa-especial-1-4.jpg'],
  ['Salchibroster Especial 1/8',14,'Salchipapas y Mas','Contiene chaufa, broaster, salchichas y cremas.', 'assets/images/products/salchibroaster-especial-1-8.jpg'],
  ['Salchibroster Especial 1/4',18,'Salchipapas y Mas','Contiene chaufa, broaster, salchichas y cremas.', 'assets/images/products/salchibroaster-especial-1-4.jpg'],
  ['Caldo de Gallina con Presa',12,'Sopas','Caldo reconfortante, gallina y mucho sabor.', 'assets/images/products/caldo-de-gallina-con-presa.jpg'],
  ['Caldo de Gallina con Huevo',8,'Sopas','Caldito casero con huevo y hierbas.', 'assets/images/products/caldo-de-gallina-con-huevo.jpg'],
  ['Saltado de Pollo',13,'Saltados','Pollo, cebolla y tomate salteados al fuego.', 'assets/images/products/saltado-de-pollo.jpg'],
  ['Lomo Saltado',14,'Saltados','Carne salteada al wok con su juguito especial.', 'assets/images/products/lomo-saltado.jpg'],
  ['Tallarín Saltado de Pollo',13,'Saltados','Tallarines y pollo al wok.', 'assets/images/products/tallarin-saltado-de-pollo.jpg'],
  ['Tallarín Saltado de Carne',14,'Saltados','Tallarines con carne y verduras salteadas.', 'assets/images/products/tallarin-saltado-de-carne.jpg'],
  ['Alitas Acevichadas',17,'Especiales','Alitas crocantes bañadas en salsa acevichada.', 'assets/images/products/alitas-acevichadas.jpg'],
  ['Alitas BBQ',16,'Especiales','Alitas doradas con salsa BBQ.', 'assets/images/products/alitas-bbq.jpg'],
  ['Alitas Mixtas',22,'Especiales','Alitas crocantes con salsa BBQ y acevichadas.', 'assets/images/products/alitas-mixtas.jpg'],
  ['1/8 de Pollo a la Brasa',9,'Pollos a la Brasa','Con papas fritas y ensalada fresca.', 'assets/images/products/octavo-de-pollo-a-la-brasa.jpg'],
  ['1/4 de Pollo a la Brasa',16,'Pollos a la Brasa','Con papas fritas y ensalada fresca.', 'assets/images/products/cuarto-de-pollo-a-la-brasa.jpg'],
  ['1/2 Pollo a la Brasa',35,'Pollos a la Brasa','Ideal para compartir, con sus guarniciones.', 'assets/images/products/medio-pollo-a-la-brasa.jpg'],
  ['Pollo Entero a la Brasa',68,'Pollos a la Brasa','El clasico completo para la mesa.', 'assets/images/products/pollo-entero-a-la-brasa.jpg'],
  ['Monstrito 1/8',13,'Combos','Chaufa, papas y 1/8 de pollo.','assets/images/products/monstrito-1-8.jpg'],
  ['Monstrito 1/4',17,'Combos','Chaufa, papas y 1/4 de pollo.', 'assets/images/products/monstrito-1-4.jpg'],
  ['Pollo a lo Pobre 1/8',15,'Combos','Pollo, huevo, platano y papas.', 'assets/images/products/pollo-a-lo-pobre-1-8.jpg'],
  ['Pollo a lo Pobre 1/4',18,'Combos','Pollo, huevo, platano y papas.', 'assets/images/products/pollo-a-lo-pobre-1-4.jpg'],
  ['Broaster 1/8',12,'Combos','Pollo broaster con papas y cremas.', 'assets/images/products/broaster-1-8.jpg'],
  ['Broaster 1/4',16,'Combos','Porcion broaster bien crocante.', 'assets/images/products/broaster-1-4.jpg'],
  ['Alitas Broaster',10,'Combos','Alitas crocantes para picar.', 'assets/images/products/alitas-broaster.jpg'],
  ['Lomo con aeropuerto',22,'Combinados','Lomo saltado con aeropuerto.', 'assets/images/products/lomo-con-aeropuerto.jpg'],
  ['Lomo con chaufa',19,'Combinados','Lomo saltado con chaufa.', 'assets/images/products/lomo-con-chaufa.jpg'],
  ['Pollo con verduras y chaufa',18,'Combinados','Pollo a la brasa con verduras y chaufa.', 'assets/images/products/pollo-con-verduras-y-chaufa.jpg'],
  ['Gaseosa 500 ml',4,'Bebidas','Coca Cola, Inca Kola, Sprite o Fanta.', 'assets/images/products/gaseosa-500-ml.jpg'],
  ['Coca Cola Personal 380 ml',3.5,'Bebidas','Bien helada para acompanar.', 'assets/images/products/coca-cola-personal-380-ml.jpg'],
  ['Inca Kola Personal 350 ml',3.5,'Bebidas','El sabor del Peru.', 'assets/images/products/inca-kola-personal-350-ml.jpg'],
  ['Gordita',5,'Bebidas','Gaseosa helada en presentacion gordita.', 'assets/images/products/gordita.jpg'],
  ['Gaseosa 1 L',7,'Bebidas','Inca Kola, Coca Cola o Guarana.', 'assets/images/products/gaseosa-1l.jpg'],
  ['Gaseosa 1.5 L',10,'Bebidas','Inca Kola, Coca Cola o Guarana.', 'assets/images/products/gaseosa-1.5l.jpg'],
  ['Chicha Morada Vaso',4,'Bebidas','Chicha morada refrescante de la casa.', 'assets/images/products/chicha-morada-vaso.jpg'],
  ['Chicha Morada Jarra 1 L',10,'Bebidas','Jarra para compartir.', 'assets/images/products/chicha-morada-jarra1l.jpg'],
  ['Agua Mineral 500 ml',2.5,'Bebidas','Agua mineral sin gas.', 'assets/images/products/agua-mineral-500ml.jpg'],
  ['Guarana',4,'Bebidas','Personal; consulta por 1 L y 1.5 L.', 'assets/images/products/guarana.jpg'],
  ['Inca Kola 3 L',15,'Bebidas','Presentacion familiar de Inka Kola.', 'assets/images/products/inca-kola3l.jpg'],
  ['Coca Cola 3 L',15,'Bebidas','Presentacion familiar de Coca Cola.', 'assets/images/products/coca-cola3l.jpg'],
].map(([name, price, category, description, image], id) => ({
  id,
  name,
  price,
  category,
  description,
  image,
}));
