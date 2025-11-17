
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock the global fetch function and related Fetch API objects that are not
// available in the Node.js environment where Jest runs.
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

// A basic mock for the Headers class
class Headers {
  constructor(headers) {
    this.headers = headers || {};
  }
  append(name, value) {
    this.headers[name] = value;
  }
  get(name) {
    return this.headers[name];
  }
}
global.Headers = Headers;

// A basic mock for the Response class
class Response {
  constructor(body, options) {
    this.body = body;
    this.status = options?.status || 200;
    this.headers = new Headers(options?.headers);
  }
  json() {
    return Promise.resolve(JSON.parse(this.body || '{}'));
  }
}
global.Response = Response;

// Mock ResizeObserver for components that use it (like Radix UI)
class ResizeObserver {
  observe() {
    // do nothing
  }
  unobserve() {
    // do nothing
  }
  disconnect() {
    // do nothing
  }
}
global.ResizeObserver = ResizeObserver;
