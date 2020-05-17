let lastUser = "";
const textEncoder = new TextEncoder();

export const PrintStatus = (
  connection: Deno.Conn,
  name: string,
  status: string,
) => {
  console.log(`**************** ${name} is ${status}***************`);
  connection.write(
    textEncoder.encode(
      `**************** ${name} is ${status}***************\n`,
    ),
  );
};

export const PrintMessage = (
  connection: Deno.Conn,
  name: string,
  message: string,
) => {
  if (name !== lastUser) {
    console.log(name + ":");
    connection.write(
      textEncoder.encode("**************** " + name + " ***************\n"),
    );
    lastUser = name;
  }

  console.log(message);
  connection.write(textEncoder.encode(message + "\n"));
};
