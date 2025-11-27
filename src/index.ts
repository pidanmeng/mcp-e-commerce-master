#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { productImageRetouching } from './tools/product-image-retouching';

const server = new FastMCP({
  name: 'mcp-photo-studio',
  version: '1.0.1',
});

server.addTool(productImageRetouching);

server.start({
  transportType: 'stdio',
});
