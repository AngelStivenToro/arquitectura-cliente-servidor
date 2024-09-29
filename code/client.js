// Client.js

// Crear constantes para usar la red y leer lineas
const net = require("net");
const readline = require("readline");

// Configurar servidor
const host = "127.0.0.1";
const port = 3000;
const client = new net.Socket();

// Crear interfaz para mostrar mensajes de leer lineas
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Función para mostrar el menú
const showMenu = () => {
  console.log(" ");
  console.log("*********************************");
  console.log("         MENÚ DE TAREAS         ");
  console.log("*********************************");
  console.log(" ");
  console.log("1 - Ver tareas");
  console.log("2 - Añadir Tareas");
  console.log("3 - Chequear Tarea");
  console.log("4 - Salir");
  console.log(" ");
  console.log("*********************************");
  console.log(" ");
  rl.setPrompt("Selecciona una opción (1-4): ");
  rl.prompt();
};

// Avisar al cliente que se conectó correctamente e iniciar servicio
client.connect(port, host, () => {
  console.log("Conectado al servidor");
  showMenu();
});

// Recibir información del server
client.on("data", (data) => {
  console.clear();
  console.log(data.toString());
  showMenu();
});

// Avisar cuando se cierra la conexión con el server
client.on("close", () => {
  console.log("Conexión cerrada");
  rl.close();
});

// Avisar cuando hay un error en la conexión con el server
client.on("error", (err) => {
  console.error("Error en el cliente:", err);
});

// Enviar información al server
rl.on("line", (line) => {
  switch (line.trim()) {
    case "1":
      client.write("SHOW_TASK");
      break;
    case "2":
      rl.question("Escribe la tarea que deseas añadir: ", (task) => {
        client.write(`ADD_TASK:${task}`);
      });
      break;
    case "3":
      rl.question(
        "Escribe el ID de la tarea que deseas chequear: ",
        (taskId) => {
          client.write(`CHANGE_STATUS:${taskId}`);
        }
      );
      break;
    case "4":
      console.log("Saliendo del sistema...");
      client.write("SALIR");
      client.end();
      break;
    default:
      console.clear();
      console.log("Opción no válida, por favor selecciona entre 1 y 4.");
      showMenu();
      break;
  }
});
