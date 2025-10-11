// Test de búsqueda Linkup
const fetch = require('node-fetch');

const testLinkupSearch = async () => {
  console.log('🔍 Probando búsqueda de Linkup...\n');
  
  const searchData = {
    query: "TDAH niños actividades educativas",
    categories: ["app", "strategy", "tool"],
    grade: "6º Primaria",
    limit: 20
  };
  
  try {
    console.log('📤 Enviando petición con:');
    console.log(JSON.stringify(searchData, null, 2));
    console.log('\n⏳ Esperando respuesta...\n');
    
    const response = await fetch('http://localhost:3001/api/linkup/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(searchData)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const results = await response.json();
    
    console.log('✅ Respuesta recibida!\n');
    console.log(`📊 Total de recursos encontrados: ${results.length}\n`);
    
    if (results.length > 0) {
      console.log('🎯 Primeros 5 resultados:\n');
      results.slice(0, 5).forEach((resource, index) => {
        console.log(`${index + 1}. ${resource.title}`);
        console.log(`   📁 Categoría: ${resource.category}`);
        console.log(`   ⭐ Relevancia: ${resource.relevance}`);
        console.log(`   🔗 URL: ${resource.url}`);
        console.log(`   📝 ${resource.description?.substring(0, 100)}...`);
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
    }
    
    console.log('\n✨ Prueba completada exitosamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLinkupSearch();
