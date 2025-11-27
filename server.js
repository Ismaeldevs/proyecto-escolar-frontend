const express = require('express');
const path = require('path');
const app = express();

const PORT = process.env.PORT || 8000;

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'dist')));

// Todas las rutas redirigen a index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Frontend corriendo en puerto ${PORT}`);
});
