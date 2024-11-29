# Ejecución de bridge local
### Preparar ambiente
1. Obtener todas las dependecias. Para esto debe ejecutar los siguientes comandos


```bash
npm install -g typescript ts-node
```
```bash
npm install
```

### Base de datos
La carpeta `src/db` contiene un yaml con la configuración de la base de datos que requiere el servicio, instale docket (https://docs.docker.com/get-docker/) y sobre la carpeta ejecute. 

```bash
docker compose up
``` 
### Ejecución del bridge local 

El servicio se incia ejecutando el archivo main.ts
```bash
ts-node src/main.ts
``` 
Si desea evitar tener que reiniciar el servicio después de cada cambio, puede instalar una herramienta como `nodemon` que monitoreará cambios del proyecto y reiniciará automáticamente el servicio; puede instalar `nodemon`
```bash
npm install -g nodemon
```

y finalmente ejecute el servicio con el comando 
```bash
nodemon src/main.ts
```

### Configuraciones predeterminadas
El bridge viene configurado con valores predeterminados que pueden necesitar ajustes según su caso de uso:

- **Wallets soportadas**: El bridge está configurado para trabajar solo con las siguientes wallets:
  - mintbank.dev

- **Esquemas soportados**: Los esquemas permitidos son:
  - caho
  - ccte
  - dbmo
  - svgs

- **Símbolos/Monedas soportadas**:
  - usd (con un factor de 100)
  - cop

Estas configuraciones se encuentran en el archivo `src/extractor.ts` y pueden ser modificadas según las necesidades específicas de su implementación.

### Core Bancario Simulado
El proyecto incluye un core bancario simulado en `src/core.ts` que viene con las siguientes cuentas predefinidas:

- **Cuenta '1'**: Cuenta sin balance
- **Cuenta '424242'**: Cuenta con balance disponible de 70
  - Balance inicial: 100,000,000
  - Débito: 10
  - En hold: 20
- **Cuenta '3'**: Cuenta sin balance disponible
  - Balance inicial: 300
  - Débito: 200
  - En hold: 100
- **Cuenta '4'**: Cuenta inactiva
  - Balance inicial: 200
  - Débito: 20

Para probar con diferentes cuentas o balances, puede modificar el constructor de la clase Ledger en `src/core.ts`.

### Sustitución de variables
Para realizar la configuración de llaves, deberá reemplazar los valores en el archivo `.env` de la siguiente manera

```bash
LEDGER_HANDLE=[nombre del ledger]
LEDGER_SERVER[servidor en el que se encuentra el ledger]
LEDGER_PUBLIC_KEY=[llave pública del ledger] 
BRIDGE_PUBLIC_KEY=[Llave pública del bridge que está configurando]
BRIDGE_SECRET_KEY=[Llave privada del bridge que está configurando]
CLIENT_ID=[client id]
CLIENT_SECRET=[client secret]
```
Nota: 
   `CLIENT_ID` y `CLIENT_SECRET` Son las credenciales del cliente que se usará para autenticar las solicitudes al servidor.


para obtener la llave pública del ledger, ejecute:
```bash
minka signer show system
```
Si usó el CLI, para generar la llave pública y privada del bridge, puede usar el siguiente comando para obtener la información
```bash
minka signer show [signer] -s
```


