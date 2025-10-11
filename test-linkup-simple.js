// Test de búsqueda Linkup con módulos nativos de Node
const http = require('http');

const testLinkupSearch = () => {
  console.log('🔍 Probando búsqueda de Linkup...\n');
  
  const searchData = JSON.stringify({
    query: "TDAH niños actividades educativas",
    categories: ["app", "strategy", "tool"],
    grade: "6º Primaria",
    limit: 20
  });
  
  console.log('📤 Enviando petición...\n');
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/linkup/search',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(searchData)
    }
  };
  
  const req = http.request(options, (res) => {
    let data = '';
    
    console.log(`✅ Estado: ${res.statusCode}\n`);
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const results = JSON.parse(data);
        
        console.log(`📊 Total de recursos encontrados: ${results.length}\n`);
        
        if (results.length > 0) {
          console.log('🎯 Primeros 5 resultados:\n');
          results.slice(0, 5).forEach((resource, index) => {
            console.log(`${index + 1}. ${resource.title}`);
            console.log(`   📁 Categoría: ${resource.category}`);
            console.log(`   ⭐ Relevancia: ${resource.relevance}`);
            console.log(`   🔗 URL: ${resource.url}`);
            console.log(`   📝 ${(resource.description || '').substring(0, 100)}...`);
            console.log('');
          });
          
          // Resumen por categorías
          const categoryCount = results.reduce((acc, r) => {
            acc[r.category] = (acc[r.category] || 0) + 1;
            return acc;
          }, {});
          
          console.log('📈 Resumen por categorías:');
          Object.entries(categoryCount).forEach(([category, count]) => {
            console.log(`   ${category}: ${count} recursos`);
          });
          
          console.log('\n✨ ¡Búsqueda de Linkup funcionando correctamente!');
        }
      } catch (error) {
        console.error('❌ Error parseando respuesta:', error.message);
        console.log('Respuesta raw:', data);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('❌ Error de conexión:', error.message);
    console.log('\n⚠️  Asegúrate de que el servidor esté corriendo en http://localhost:3001');
  });
  
  req.write(searchData);
  req.end();
};

testLinkupSearch();
