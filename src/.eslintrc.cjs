/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  
  // 🔥🔥🔥 REGLA DE EXCEPCIÓN CLAVE 🔥🔥🔥
  rules: {
    // 1. Desactiva la regla que nos molesta en React
    'no-unused-vars': 'off',
    
    // 2. Usar la regla de Typescript que es más inteligente (incluso si no usamos TS)
    // Esto permite que las variables que EMPIEZAN por "_" sean ignoradas
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        'argsIgnorePattern': '^_',
        'varsIgnorePattern': '^_',
        'caughtErrorsIgnorePattern': '^_'
      }
    ],
    // 3. Regla que teníamos antes: Ignora la queja de los exports en Context
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
  },
}
```

### 🎯 Una vez que hagas esto:

Vuelve a tu archivo **`src/Contextos/DatosContext.jsx`** y asegúrate de que todos los `catch` problemáticos estén usando un guion bajo `_`:

```javascript
// Donde sale el error, asegúrate que se vea así:
} catch (_error) { return { success: false, message: "Error conexión" }; }
```

**Si `_error` sigue saliendo rojo después de instalar la regla, prueba con solo un guion bajo en el `catch` que está vacío:**

```javascript
// Bloque que fallaba si estaba vacío:
} catch (_) {} 
// Esto es el máximo nivel de ignorancia que puedes aplicar a un catch.ss