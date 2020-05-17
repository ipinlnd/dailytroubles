import { PrintMessage, PrintStatus } from "./messagePrinter.ts";
import { User } from "./types.ts";

const connections: User[] = [];

const reader = async (current: User) => {
  connections
    .filter((x) => x.conn !== current.conn)
    .forEach((x) => PrintStatus(x.conn, current.name, "connected"));
  let message = new Uint8Array(120);
  let count = await current.conn.read(message);

  while (count && current.conn) {
    const decoded = new TextDecoder().decode(message).replace("\n", "");
    console.log(connections.length);
    connections
      .filter((x) => x.conn !== current.conn)
      .forEach((x) => PrintMessage(x.conn, current.name, decoded));
    message = new Uint8Array(120);
    count = await current.conn.read(message);
  }

  connections
    .filter((x) => x.conn !== current.conn)
    .forEach((x) => PrintStatus(x.conn, current.name, "disconnected"));

  const index = connections.findIndex((x) => x.conn === current.conn);
  connections.splice(index, 1);
  return;
};

const listener = Deno.listen({ port: 8080 });
console.log("listening on 0.0.0.0:8080");
for await (const conn of listener) {
  if (connections.length === 2) {
    conn.close();
    continue;
  }
  let user = "";
  const input = new Uint8Array(20);
  await conn.write(new TextEncoder().encode("Enter your name first:"));
  await conn.read(input);
  user = new TextDecoder().decode(input).replace("\n", "").trimRight();

  connections.push({
    conn,
    name: user,
  });
  console.log(connections.length);
  reader(connections[connections.length - 1]);
}
