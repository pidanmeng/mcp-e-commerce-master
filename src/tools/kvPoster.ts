import z from 'zod';
import { qwenToolGenerator } from '../utils/comfyui';

export const kvPoster = qwenToolGenerator({
  name: '3D电商KV海报',
  description: '生成3D电商KV海报',
  parameters: z.object({
    prompt: z.string().optional().describe('提示词，建议：FY style + 自然语言描述内容'),
  }),
  promptAdapter: (args, defaultArgs) => {
    return args.prompt || defaultArgs?.prompt || '';
  },
  defaultParams: {
    prompt:
      'KV style,赛博朋克风电商促销场景，3D卡通渲染风格。卡通狐狸形象，橙白渐变毛色，头顶炫彩闪电纹路，佩戴蓝色带"Jiguang"字样的AR眼镜，身着荧光蓝带紫色光带的冲锋衣、黑色机能风短裤，脚踩绿色悬浮滑板；周围环绕着极光能量饮料罐（霓虹紫色包装，标注"闪电能量"）、极光维生素水（炫彩镭射包装）等产品。卡通狐狸单脚立于悬浮滑板，双手展开保持平衡，身体前倾呈现高速滑行姿态，尾巴扬起散发粒子光效。赛博朋克风格的霓虹蓝色调未来街景，有荧光粉与 cyan 蓝色的全息广告牌，巨型机械手臂悬挂着"超品日"立体字样，银色传送带滚动展示商品包装盒，空中漂浮着透明数据流与折扣标签。色调以霓虹蓝、荧光粉、金属银为主，光线充满激光射线与全息投影效果；产品包装呈现金属拉丝与荧光涂层质感，悬浮滑板底部喷射蓝色离子气流，背景建筑表面布满数码纹理与流动的光带。顶部红色立体艺术字"狂欢盛典 限时5折"，字体厚重带有金属镶边与霓虹光晕，数字"5"为渐变荧光绿色；下方蓝色六边形立体字"跨店每满300减60"，字体棱角分明带有电路板纹理，内部填充流动光效。充满科技感与未来元素的电商大促场景，动态光线与悬浮元素交织，传递出潮流科技与购物狂欢的震撼视觉体验。',
  },
  defaultHeight: 1140,
  defaultWidth: 1472,
  additionalNetwork: [
    {
      modelId: '85e4254fc4434928a434d2194faf4f36',
      weight: 0.8,
    },
  ],
  enable8Step: true,
});