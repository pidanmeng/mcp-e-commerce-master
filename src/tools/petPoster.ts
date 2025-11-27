import z from 'zod';
import { qwenToolGenerator } from '../utils/comfyui';

export const petPoster = qwenToolGenerator({
  name: '宠物风格海报',
  description: '生成卡通风格宠物海报（默认 16:9）',
  parameters: z.object({
    prompt: z.string().optional().describe('提示词'),
  }),
  promptAdapter: (args, defaultArgs) => {
    return args.prompt || defaultArgs?.prompt || '';
  },
  defaultParams: {
    prompt:
      '生成一个以宠物为主题的卡通风格海报，包含多种可爱的宠物形象和活泼的背景元素。海报应传达出欢乐、友好的氛围，适合家庭和儿童观看。请确保海报色彩鲜艳，细节丰富。',
  },
  defaultHeight: 900,
  defaultWidth: 1600,
  additionalNetwork: [
    {
      modelId: 'ee76cdd3068042d3a15717809fab343b',
      weight: 0.7,
    },
  ],
  enable8Step: true,
});
