interface ITcpMessage {
  message: string;
  headers: {
    id: string;
    len: number;
    pos: number;
  };
}
interface ITcpApi {
  sendMessage(msg: ITcpMessage): void;
  onReceive(handler: (msg: ITcpMessage) => void): void;
}
interface IReliableApi {
  limit: number;
  messages: Map<string, { parts: string[]; cnt: number }>;
  init(limit: number): void;
  sendMessage(msg: string): void;
  onReceive(handler: (msg: string) => void): void;
}

// helpers
function randomString(n: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz';
  const randomValues = new Uint32Array(n);
  crypto.getRandomValues(randomValues);
  return Array.from(randomValues, (value) => chars[value % chars.length]).join('');
}

// tcpApi
let onMessage = (_msg: ITcpMessage) => {};
const tcpApi: ITcpApi = {
  sendMessage(msg: ITcpMessage) {
    setTimeout(() => {
      onMessage(msg);
    }, Math.random() * 100);
  },
  onReceive(handler) {
    onMessage = handler;
  },
};

// reliableApi
let onReliableMessage = (_msg: string) => {};
const reliableApi: IReliableApi = {
  limit: 5,
  messages: new Map<string, { parts: string[]; cnt: number }>(),
  init(limit: number) {
    this.limit = limit;
    tcpApi.onReceive((msg: ITcpMessage) => {
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
        onReliableMessage(newMessage);
      }
    });
  },
  sendMessage(msg: string) {
    const id = crypto.randomUUID();
    const len = Math.ceil(msg.length / this.limit);
    for (let i = 0; i < len; i++) {
      const part = msg.substring(i * this.limit, (i + 1) * this.limit);
      tcpApi.sendMessage({ headers: { id, len, pos: i }, message: part });
    }
  },
  onReceive(handler) {
    onReliableMessage = handler;
  },
};

export { tcpApi, reliableApi, randomString };
export type { ITcpMessage, ITcpApi };
