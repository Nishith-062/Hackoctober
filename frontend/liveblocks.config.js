// liveblocks.config.js
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

export const client = createClient({
  publicApiKey: "pk_dev_pkxO4QbpECLah-ZRKhPSilMQHi-uKvGII2AzemnVWyi0Tc3rKS0HkJq7MMNh7GCh",
});

// Create the room context with React hooks
export const { 
  RoomProvider, 
  useRoom, 
  useSelf, 
  useOthers, 
  useMyPresence, 
  useUpdateMyPresence 
} = createRoomContext(client);