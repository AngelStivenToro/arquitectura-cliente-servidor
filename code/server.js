// Server.js

// Crear constantes para usar la red y puerto
const net = require("net");
const port = 3000;

let tasks = [];

const server = net.createServer((socket) => {
  // Avisar que el cliente se conectó
  console.log("Cliente conectado");

  // Recibir request de cliente
  socket.on("data", (data) => {
    const request = data.toString().trim();
    console.log(" ");

    // Lógica
    if (request.startsWith("ADD_TASK:")) {
      const taskDescription = request.split(":")[1];
      const newTask = {
        id: tasks.length + 1,
        task: taskDescription,
        complete: false,
      };
      tasks.push(newTask);
      console.log(`El usuario agrego un nuevo usuario`);
      socket.write(`Tarea añadida: ${taskDescription}`);
    } else if (request === "SHOW_TASK") {
      if (tasks.length > 0) {
        tasks.map((task) =>
          socket.write(
            `Tarea: ${task.id} - ${task.task}, Estado: ${
              task.complete ? "Completada" : "Por hacer"
            } \n`
          )
        );
        console.log("El usuario busco las tareas");
      } else {
        socket.write("Aún no hay tareas guardadas\n");
      }
    } else if (request.startsWith("CHANGE_STATUS")) {
      const taskId = request.split(":")[1];

      const taskFind = tasks.find((task) => task.id == taskId);

      if (taskFind.complete) {
        return socket.write("Esta tarea ya se completo");
      }

      taskFind.complete = !taskFind.complete;

      const nowTask = tasks.filter((task) => task != taskFind);

      tasks = [...nowTask, taskFind];
      console.log("El usuario a cabiado el estado de una tarea");
    }
  });

  // Avisar que el cliente se desconectó
  socket.on("end", () => {
    console.log(" ");
    console.log("Cliente desconectado");
    console.log(" ");
  });
});

// Mostrar por consola el puerto del servidor
server.listen(port, () => {
  console.log(" ");
  console.log(`Servidor de chat escuchando en puerto ${port}`);
});
