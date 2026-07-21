const { TextEncoder, TextDecoder } = require('util');
const { ReadableStream, WritableStream, TransformStream } = require('stream/web');
const { MessageChannel, MessagePort } = require('worker_threads');
const { Blob } = require('buffer');

if (typeof global.TextEncoder === 'undefined') {
  global.TextEncoder = TextEncoder;
}
if (typeof global.TextDecoder === 'undefined') {
  global.TextDecoder = TextDecoder;
}
if (typeof global.ReadableStream === 'undefined') {
  global.ReadableStream = ReadableStream;
}
if (typeof global.WritableStream === 'undefined') {
  global.WritableStream = WritableStream;
}
if (typeof global.TransformStream === 'undefined') {
  global.TransformStream = TransformStream;
}
if (typeof global.MessageChannel === 'undefined') {
  global.MessageChannel = MessageChannel;
}
if (typeof global.MessagePort === 'undefined') {
  global.MessagePort = MessagePort;
}
if (typeof global.Blob === 'undefined') {
  global.Blob = Blob;
}
