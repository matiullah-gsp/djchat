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
  channels: Channel[];
}

export interface Message {
  id: string;
  conversation: string;
  content: string;
  sender: string;
  timestamp: string;
}

export interface ChannelMessages {
  messages: Message[];
}
