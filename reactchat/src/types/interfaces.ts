export interface Channel {
  id: string;
  name: string;
  topic: string;
  banner: string | null;
  icon: string | null;
  server: string;
  owner: string;
}

export interface Server {
  id: string;
  name: string;
  description: string | null;
  owner: string;
  category: string;
  channel_server: Channel[];
}

export interface Message {
  id: number;
  text: string;
  author: string;
  timestamp: string;
  channel: string;
}

export interface ChannelMessages {
  messages: Message[];
}
