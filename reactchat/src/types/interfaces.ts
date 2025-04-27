export interface Channel {
  id: number;
  name: string;
  topic: string;
  banner: string | null;
  icon: string | null;
  server: number;
  owner: number;
}

export interface Server {
  id: number;
  name: string;
  description: string | null;
  owner: number;
  category: string;
  channel_server: Channel[];
}

export interface Message {
  id: number;
  text: string;
  author: string;
  timestamp: string;
}

export interface ChannelMessages {
  messages: Message[];
}
