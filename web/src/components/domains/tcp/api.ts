interface ITcpMessage {
  headers: {
    id: string;
    type: 'MSG' | 'ACK';
    len: number;
    pos: number;
  };
  message?: string;
}
interface ITcpApi {
  sendMessage(msg: ITcpMessage): void;
  onReceive(handler: (msg: ITcpMessage) => void): void;
}
interface IReliableApi {
  limit: number;
  messages: Map<string, { parts: string[]; cnt: number }>;
  sendMessage(msg: string): void;
  onReceive(handler: (msg: string) => void): void;
  init(limit: number): void;
}

// tcpApi
const onMessageHandlers = new Set<(msg: ITcpMessage) => void>();
const tcpApi: ITcpApi = {
  sendMessage(msg: ITcpMessage) {
    setTimeout(() => {
      onMessageHandlers.forEach((handler) => handler(msg));
    }, Math.random() * 1000);
  },
  onReceive(handler) {
    onMessageHandlers.add(handler);
  },
};

// reliableApi
let onReliableMessageHandlers = new Set<(msg: string) => void>();
const reliableApi: IReliableApi = {
  limit: 5,
  messages: new Map<string, { parts: string[]; cnt: number }>(),
  sendMessage(msg: string) {
    const id = crypto.randomUUID().split('-')[0];
    const len = Math.ceil(msg.length / this.limit);
    for (let i = 0; i < len; i++) {
      const part = msg.substring(i * this.limit, (i + 1) * this.limit);
      tcpApi.sendMessage({ headers: { id, type: 'MSG', len, pos: i }, message: part });
    }
  },
  onReceive(handler) {
    onReliableMessageHandlers.add(handler);
  },
  init(limit: number) {
    this.limit = limit;
    tcpApi.onReceive((msg: ITcpMessage) => {
      if (msg.headers.type === 'ACK') {
        onReliableMessageHandlers.forEach((handler) => handler('delivered'));
      }
      if (msg.headers.type === 'MSG') {
        const id = msg.headers.id;
        const len = msg.headers.len;
        const pos = msg.headers.pos;
        if (!this.messages.has(id)) {
          const parts = new Array(len).fill(null);
          this.messages.set(id, { parts, cnt: 0 });
        }
        const item = this.messages.get(id) ?? ({} as any);
        const parts = [...item.parts];
        const cnt = item.cnt + 1;
        parts[pos] = msg.message;
        this.messages.set(id, { parts, cnt });
        if (cnt === len) {
          this.messages.delete(id);
          const newMessage = `${parts.join('')}`;
          onReliableMessageHandlers.forEach((handler) => handler(newMessage));
          tcpApi.sendMessage({ headers: { id, type: 'ACK', len, pos: 0 } });
        }
      }
    });
  },
};

export { tcpApi, reliableApi };
export type { ITcpMessage, ITcpApi };
