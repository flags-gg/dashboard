import '@testing-library/jest-dom';

// Polyfill Web APIs needed by next/server in test environment
import { TextEncoder, TextDecoder } from 'util';

class MockHeaders extends Map<string, string> {
  constructor(init?: Record<string, string> | [string, string][]) {
    if (Array.isArray(init)) {
      super(init);
    } else {
      super(Object.entries(init ?? {}));
    }
  }
}

class MockRequest {
  url: string;
  method: string;
  headers: MockHeaders;
  cache: string;
  private _bodyText: string | null;

  constructor(input: string | URL, init?: RequestInit) {
    this.url = typeof input === 'string' ? input : input.toString();
    this.method = init?.method ?? 'GET';
    this.headers = new MockHeaders(
      init?.headers
        ? Object.entries(init.headers as Record<string, string>)
        : []
    );
    this._bodyText = typeof init?.body === 'string' ? init.body : null;
    this.cache = (init as Record<string, unknown>)?.cache as string ?? 'default';
  }

  async json() {
    return JSON.parse(this._bodyText ?? '{}');
  }

  async text() {
    return this._bodyText ?? '';
  }
}

class MockResponse {
  status: number;
  ok: boolean;
  statusText: string;
  headers: MockHeaders;
  private _body: string;
  private _jsonData: unknown;

  constructor(body?: BodyInit | null, init?: ResponseInit) {
    this._body = typeof body === 'string' ? body : '{}';
    this._jsonData = undefined;
    this.status = init?.status ?? 200;
    this.ok = this.status >= 200 && this.status < 300;
    this.statusText = init?.statusText ?? '';
    this.headers = new MockHeaders();
  }

  async json() {
    if (this._jsonData !== undefined) return this._jsonData;
    return JSON.parse(this._body);
  }

  async text() {
    return this._body;
  }

  static json(data: unknown, init?: ResponseInit): MockResponse {
    const resp = new MockResponse(JSON.stringify(data), init);
    resp._jsonData = data;
    return resp;
  }
}

Object.assign(global, {
  TextEncoder,
  TextDecoder,
  Request: MockRequest,
  Response: MockResponse,
  Headers: MockHeaders,
});
