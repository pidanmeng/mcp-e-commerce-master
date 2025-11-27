#!/usr/bin/env node
import { FastMCP } from 'fastmcp';
import { checkImageGenerationStatus } from './tools/check-image-generation-status';
import { productImageRetouching } from './tools/product-image-retouching';
import { sceneRendering } from './tools/scene-rendering-from-product-image';
import { petPoster } from './tools/petPoster';
import { petPosterHelper } from './tools/petPosterHelper';
import { productPoster } from './tools/productPoster';
import { productPosterHelper } from './tools/productPosterHelper';
import { xiaohongshuPoster } from './tools/xiaohongshuPoster';
import { xiaohongshuPosterHelper } from './tools/xiaohongshuPosterHelper';
import { kvPoster } from './tools/kvPoster';
import { kvPosterHelper } from './tools/kvPosterHelper';

const server = new FastMCP({
  name: 'e-commerce-master',
  version: '1.0.1',
});

server.addTool(checkImageGenerationStatus);
server.addTool(productImageRetouching);
server.addTool(sceneRendering);
server.addTool(petPoster);
server.addTool(petPosterHelper);
server.addTool(productPoster);
server.addTool(productPosterHelper);
server.addTool(xiaohongshuPoster);
server.addTool(xiaohongshuPosterHelper);
server.addTool(kvPoster);
server.addTool(kvPosterHelper);

server.start({
  transportType: 'stdio',
});