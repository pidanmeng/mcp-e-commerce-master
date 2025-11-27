import { Tool } from 'fastmcp';
import z from 'zod';

const name = '小红书风格海报提示词助手';
const description = '包含推荐的小红书风格海报提示词';

export const xiaohongshuPosterHelper: Tool<any, any> = {
  name,
  description,
  parameters: z.object({}),
  execute: async (_args, _context) => {
    return `推荐提示词：

1. 升学季海报,主标题写着"逐梦学海,金榜有名",白色毛笔字,蓝金配色,一个青年高举毕业证书,表情自信,周围飘散着桂花和光芒,空中飞舞彩纸片,简约大气,扁平插画风格,下方副标语"荣耀加冕,筑梦新程"

2. 美食节宣传海报,卡通青年围坐餐桌,桌上有披萨,cake,咖啡和饮品,周围漂浮气球和彩带,背景是温暖橙色灯光,主标题"美味共享 快乐相聚",副标语"FOOD FESTIVAL""享受美食 享受生活""味蕾狂欢 幸福满满",整体风格活泼明快,色彩鲜艳,扁平插画,设计感突出

3. 艺术绘画展宣传海报，卡通学生手持画笔作画，周围漂浮颜料、画笔、画架、调色盘，背景明亮温暖，有渐变彩色光晕，主标题"色彩的世界 梦想的画布"，副标语"ART FESTIVAL""让创意自由飞翔"，整体风格活泼明快，色彩鲜艳，扁平插画，设计感突出`;
  },
};
