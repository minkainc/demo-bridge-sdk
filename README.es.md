
# Ejecución de bridge local
### Preparar ambiente
1. Obtener todas las dependecias. Para esto debe ejecutar los siguientes comandos


```bash
npm install -g typescript ts-node
```

```bash
npm install @minka/bridge-sdk
```
```bash
npm install @minka/ledger-sdk
```
```bash
npm install envalid dotenv
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

### Sustitución de variables
Para realizar la configuración de llaves, deberá reemplazar los valores en el archivo `.env` de la siguiente manera

```bash
LEDGER_HANDLE=[nombre del ledger]
LEDGER_SERVER[servidor en el que se encuentra el ledger]
LEDGER_PUBLIC_KEY=[llave pública del ledger] 
BRIDGE_PUBLIC_KEY=[Llave pública del bridge que está configurando]
BRIDGE_SECRET_KEY=[Llave privada del bridge que está configurando]
```

para obtener la llave pública del ledger, ejecute:
```bash
minka signer show system
```
Si usó el CLI, para generar la llave pública y privada del bridge, puede usar el siguiente comando para obtener la información
```bash
minka signer show [signer] -s
```


# Ejecución de script para generar intent

Para generar intents puede usar el archivo `src/intent/create.intent.js` para ello, deberá actualizar la información de configuración donde se requiere una llave que tenga permisos de creación de un intent. Esto quiere decir, un signer que pertenezca al circulo desde donde se realiza el debito - owner@domain - (en este caso el script lanza un pago desde el banco testla) 

Para la ejecución de script, puede usar la información del signer `teslabank`, para obtener la información de la llave pública y privada, para esto haga login con `teslabank` y luego ejecute:

```bash
minka signer show teslabank -s
```
Con esta información podrá actualizar los valores `INTENT_PUBLIC_KEY` y `INTENT_PRIVATE_KEY`
```bash
const config = {
    LEDGER_SERVER: [servidor del ledger],
    LEDGER_HANDLE: [nombre del ledger],
    INTENT_PUBLIC_KEY: "",
    INTENT_PRIVATE_KEY:""
}
```
Ahora si podrá ejecutar el comando 
```bash
node src/intent/create.intent.js
```
