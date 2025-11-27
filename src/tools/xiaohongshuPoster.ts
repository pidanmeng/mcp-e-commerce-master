import z from 'zod';
import { qwenToolGenerator } from '../utils/comfyui';

export const xiaohongshuPoster = qwenToolGenerator({
  name: '小红书风格海报',
  description: '生成小红书风格的海报',
  parameters: z.object({
    prompt: z
      .string()
      .optional()
      .describe('提示词，建议：FY style + 自然语言描述内容'),
  }),
  promptAdapter: (args, defaultArgs) => {
    return `FY style, ${args.prompt || defaultArgs?.prompt}`;
  },
  defaultParams: {
    prompt:
      '升学季海报,主标题写着"逐梦学海,金榜有名",白色毛笔字,蓝金配色,一个青年高举毕业证书,表情自信,周围飘散着桂花和光芒,空中飞舞彩纸片,简约大气,扁平插画风格,下方副标语"荣耀加冕,筑梦新程"',
  },
  defaultHeight: 1140,
  defaultWidth: 1472,
  additionalNetwork: [
    {
      modelId: 'f0679c6b1c5842d98b9d402dbd46c365',
      weight: 1,
    },
  ],
  enable8Step: true,
});
