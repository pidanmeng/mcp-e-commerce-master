import z from 'zod';
import { qwenToolGenerator } from '../utils/comfyui';

export const productPoster = qwenToolGenerator({
  name: '电商产品海报',
  description: ' 质感商业级电商产品场景海报',
  parameters: z.object({
    prompt: z
      .string()
      .optional()
      .describe('提示词，建议：Product Scene Poster + 自然语言描述内容'),
  }),
  promptAdapter: (args, defaultArgs) => {
    return `Product Scene Poster, ${args.prompt || defaultArgs?.prompt}`;
  },
  defaultParams: {
    prompt:
      '商业级奢侈品香水摄影，方形深琥珀色香水瓶（瓶身通透莹润，内部液体浓郁且折射暖光，瓶身印 “LOUIS MARCO Deep Woody” 清晰字样），顶部配纹理细腻、质感温润的木质瓶盖；香水瓶置于深棕色菱格纹皮革表面（皮革柔软有光泽、纹理精致）；背景为暖棕到深棕的渐变色调，一束柔和暖黄色光线精准照射，在瓶身营造通透光泽感，细腻勾勒木质瓶盖纹理，让皮革表面形成柔和明暗过渡；整体氛围奢华温暖，光影层次分明，细节极致精致，凸显高端商业产品质感，8K 高清画质。',
  },
  defaultHeight: 1140,
  defaultWidth: 1472,
  additionalNetwork: [
    {
      modelId: 'a17ee988cbe94bd299819fd393815166',
      weight: 1,
    },
  ],
  enable8Step: true,
});
