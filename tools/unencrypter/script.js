// Función para calcular el hash (sin timestamp)
async function calculateHash(correct, total, timeLeft, score) {
  const dataString = `${correct}-${total}-${timeLeft}-${score}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(dataString);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Función para calcular el puntaje (igual que el juego)
function calculateScore(correct, total, timeLeft) {
  const accuracy = correct / (total || 1);
  const multiplier = timeLeft / 120;
  return Math.floor((correct * 10 + accuracy * 5) * multiplier * 120);
}

// Función principal de verificación
async function verifyHash(targetHash) {
  const startTime = performance.now();
  let attempts = 0;
  
  // Rangos basados en las reglas del juego
  for (let correct = 0; correct <= 5; correct++) {
      for (let total = correct; total <= 7; total++) {
          for (let timeLeft = 0; timeLeft <= 120; timeLeft++) {
              const score = calculateScore(correct, total, timeLeft);
              attempts++;
              
              // Solo mostrar progreso cada 1000 intentos para no saturar la UI
              if (attempts % 1000 === 0) {
                  document.getElementById('loading').querySelector('p').textContent = 
                      `Verificando... (${attempts.toLocaleString()} combinaciones probadas)`;
              }
              
              const currentHash = await calculateHash(correct, total, timeLeft, score);
              
              if (currentHash === targetHash) {
                  return {
                      success: true,
                      correct,
                      total,
                      timeLeft,
                      score,
                      attempts,
                      timeTaken: ((performance.now() - startTime) / 1000).toFixed(2)
                  };
              }
          }
      }
  }
  
  return {
      success: false,
      attempts,
      timeTaken: ((performance.now() - startTime) / 1000).toFixed(2)
  };
}

// Evento del botón
document.getElementById('verifyBtn').addEventListener('click', async function() {
  const hashInput = document.getElementById('hashInput').value.trim();
  const resultDiv = document.getElementById('result');
  const loadingDiv = document.getElementById('loading');
  
  if (!hashInput || hashInput.length !== 64) {
      resultDiv.style.display = 'block';
      resultDiv.className = 'invalid';
      document.getElementById('resultTitle').textContent = 'Error';
      document.getElementById('resultDetails').innerHTML = 
          'Por favor ingrese un hash SHA-256 válido (64 caracteres hexadecimales)';
      return;
  }
  
  // Preparar la UI para la búsqueda
  this.disabled = true;
  loadingDiv.style.display = 'block';
  resultDiv.style.display = 'none';
  
  // Ejecutar la verificación
  const verification = await verifyHash(hashInput);
  
  // Mostrar resultados
  loadingDiv.style.display = 'none';
  this.disabled = false;
  resultDiv.style.display = 'block';
  
  if (verification.success) {
      resultDiv.className = 'valid';
      document.getElementById('resultTitle').textContent = '¡Hash verificado con éxito!';
      document.getElementById('resultDetails').innerHTML = `
          <div class="param"><strong>Respuestas correctas:</strong> ${verification.correct}/5</div>
          <div class="param"><strong>Total de intentos:</strong> ${verification.total}</div>
          <div class="param"><strong>Tiempo restante:</strong> ${verification.timeLeft} segundos</div>
          <div class="param"><strong>Puntaje calculado:</strong> ${verification.score}</div>
          <div class="param"><small>Combinaciones probadas: ${verification.attempts.toLocaleString()}</small></div>
          <div class="param"><small>Tiempo de búsqueda: ${verification.timeTaken} segundos</small></div>
      `;
  } else {
      resultDiv.className = 'invalid';
      document.getElementById('resultTitle').textContent = 'No se encontró coincidencia';
      document.getElementById('resultDetails').innerHTML = `
          <p>No se encontraron parámetros válidos que generen este hash.</p>
          <div class="param"><small>Combinaciones probadas: ${verification.attempts.toLocaleString()}</small></div>
          <div class="param"><small>Tiempo de búsqueda: ${verification.timeTaken} segundos</small></div>
          <p>Posibles causas:</p>
          <ul>
              <li>El hash incluye un timestamp (no soportado en esta versión simplificada)</li>
              <li>El hash fue modificado o es incorrecto</li>
              <li>Los parámetros están fuera de los rangos esperados</li>
          </ul>
      `;
  }
});