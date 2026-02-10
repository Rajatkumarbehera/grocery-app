import axios from "axios";

export default async function emitEventHandler({
  event,
  data,
  socketId,
}: {
  event: string;
  data: any;
  socketId?: string;
}) {
  try {
    await axios.post(`${process.env.NEXT_PUBLIC_SOCKET_SERVER_URL}/notify`, {
      event,
      data,
      socketId,
    });
  } catch (error) {
    console.log(error);
  }
}
