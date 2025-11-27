import type { Tool } from 'fastmcp';
import { z } from 'zod';
import { useLogger } from '../utils/logger';
import { invokeComfyUIWorkflow, GenerateParams } from '../utils/comfyui';

const name = '产品场景渲染图';
const description =
  '通过产品图生成带场景的渲染图工具，基于产品图片生成具有特定场景的高质量渲染图';
const parameters = z.object({
  productImageUrl: z.string().url().describe('产品图的URL地址'),
  prompt: z.string().describe('场景描述提示词'),
  size: z
    .enum(['1k', '2k', '4k'])
    .optional()
    .describe('生成图片尺寸，可选1k、2k、4k'),
  width: z.number().optional().describe('图片宽度'),
  height: z.number().optional().describe('图片高度'),
});

type SceneRenderingParams = z.infer<typeof parameters>;

const sceneRendering: Tool<any, z.ZodType<SceneRenderingParams>> = {
  name,
  description,
  parameters,
  execute: async (args, context) => {
    const {
      productImageUrl,
      prompt,
      size = '2k',
      width = 2048,
      height = 2048,
    } = args;
    const { log } = context;
    const logger = useLogger(log);

    logger.info('Starting scene rendering from product image', {
      productImageUrl,
      prompt,
      size,
      width,
      height,
    });

    // 定义工作流参数
    const generateParams: GenerateParams = {
      '15': {
        class_type: 'LoadImage',
        inputs: {
          image: productImageUrl,
        },
      },
      '20': {
        class_type: 'LibLibSeedreamV4Node',
        inputs: {
          size,
          prompt,
          width,
          height,
        },
      },
      workflowUuid: 'ea602af6a9cc4e19b0b92d74e95dd5f9',
    };

    try {
      // 调用ComfyUI工作流
      const result = await invokeComfyUIWorkflow({
        templateUuid: '4df2efa0f18d46dc9758803e478eb51c',
        generateParams,
      });

      logger.info('Scene rendering workflow initiated', {
        result: result,
      });
      return result;
    } catch (error) {
      logger.error('Failed to execute scene rendering', {
        error: (error as Error).message,
      });
      return 'Failed to execute scene rendering';
    }
  },
};

export { sceneRendering };
