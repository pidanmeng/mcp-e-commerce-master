import { createHmac } from 'crypto';
import { useLogger } from './logger';
import z from 'zod';
import { Tool } from 'fastmcp';

// 定义基础URL
const BASE_URL = 'https://openapi.liblibai.cloud';

interface SignatureOptions {
  url: string;
  secretKey: string;
}

interface SignatureResult {
  signature: string;
  timestamp: number;
  signatureNonce: string;
}

type ParamsInput = {
  class_type: string;
  inputs: Record<string, string | number | boolean>;
};

export type GenerateParams = {
  workflowUuid: string;
  [nodeId: string]: ParamsInput | string;
};

interface ComfyUIRequest<T extends GenerateParams> {
  templateUuid: string;
  generateParams: T;
}

// 添加查询生图结果的响应数据接口
export interface ImageInfo {
  /**
   * 1：待审核
   * 2：审核中
   * 3：审核通过
   * 4：审核拦截
   * 5：审核失败
   */
  auditStatus: number;
  imageUrl: string;
  nodeId: string;
  outputName: string;
}

export interface GenerateStatusResult {
  accountBalance: number;
  /**
   * 1：等待执行
   * 2：执行中
   * 3：已生图
   * 4：审核中
   * 5：任务成功
   * 6：任务失败
   */
  generateStatus: number;
  generateUuid: string;
  images: ImageInfo[];
  percentCompleted: number;
  pointsCost: number;
  videos: any[];
  generateMsg?: string;
}

interface ComfyUIStatusResponse {
  code: number;
  data: GenerateStatusResult;
  msg: string;
}

/**
 * 生成签名
 * @param options 签名选项
 * @returns 签名结果
 */
export function generateSignature(options: SignatureOptions): SignatureResult {
  const { url, secretKey } = options;
  const timestamp = Date.now();
  const signatureNonce = Math.random().toString(36).substring(2, 18);

  // 原文 = URL地址 + "&" + 毫秒时间戳 + "&" + 随机字符串
  const str = `${url}&${timestamp}&${signatureNonce}`;

  // 使用 HMAC-SHA1 算法生成签名
  const hmac = createHmac('sha1', secretKey);
  hmac.update(str);
  const hash = hmac.digest('base64');

  // 生成安全字符串
  let signature = hash
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  return {
    signature,
    timestamp,
    signatureNonce,
  };
}

/**
 * 构建带认证参数的URL
 * @param path API路径
 * @param accessKey 访问密钥
 * @param secretKey 密钥
 * @returns 带认证参数的完整URL
 */
function buildAuthUrl(path: string, accessKey: string, secretKey: string) {
  const { signature, timestamp, signatureNonce } = generateSignature({
    url: path,
    secretKey,
  });

  const params = new URLSearchParams({
    AccessKey: accessKey,
    Signature: signature,
    Timestamp: timestamp.toString(),
    SignatureNonce: signatureNonce,
  });

  return `${BASE_URL}${path}?${params.toString()}`;
}

/**
 * 调用ComfyUI工作流
 * @param request 请求参数
 * @returns Promise<string>
 */
export async function invokeComfyUIWorkflow<T extends GenerateParams>(
  request: ComfyUIRequest<T>
): Promise<string> {
  const { templateUuid, generateParams } = request;
  const logger = useLogger();

  try {
    // 从环境变量获取认证信息
    const accessKey = process.env.LIB_ACCESS_KEY;
    const secretKey = process.env.LIB_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error(
        'Missing LIB_ACCESS_KEY or LIB_SECRET_KEY environment variables'
      );
    }

    // 构建带认证参数的URL
    const path = '/api/generate/comfyui/app';
    const authUrl = buildAuthUrl(path, accessKey, secretKey);
    const body = {
      templateUuid,
      generateParams,
    };

    logger.info('authUrl', authUrl);
    logger.info('body', body);

    // 发送请求
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = (await response.json()) as ComfyUIStatusResponse;
    logger.info('ComfyUI workflow invoked successfully', {
      templateUuid,
      statusCode: response.status,
      result: String(result),
    });

    if (result.code !== 0 || !result.data) {
      throw new Error(`API Error: ${result.msg}`);
    }
    return JSON.stringify(result.data);
  } catch (error) {
    logger.error('Failed to invoke ComfyUI workflow', {
      error: (error as Error).message,
      templateUuid: request.templateUuid,
    });
    return `Failed to invoke ComfyUI workflow: ${error as string}`;
  }
}

/**
 * 查询生图任务状态
 * @param generateUuid 生图任务UUID
 * @returns Promise<GenerateStatusResult>
 */
export async function queryComfyUIImageStatus(
  generateUuid: string
): Promise<GenerateStatusResult | string> {
  const logger = useLogger();

  try {
    // 从环境变量获取认证信息
    const accessKey = process.env.LIB_ACCESS_KEY;
    const secretKey = process.env.LIB_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error(
        'Missing LIB_ACCESS_KEY or LIB_SECRET_KEY environment variables'
      );
    }

    // 构建带认证参数的URL
    const path = '/api/generate/comfy/status';
    const authUrl = buildAuthUrl(path, accessKey, secretKey);

    // 发送请求
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        generateUuid,
      }),
    });

    const result = (await response.json()) as ComfyUIStatusResponse;

    if (result.code !== 0) {
      throw new Error(`API Error: ${result.msg}`);
    }

    logger.info('ComfyUI image status queried successfully', {
      generateUuid,
      statusCode: response.status,
      generateStatus: result.data.generateStatus,
      percentCompleted: result.data.percentCompleted,
    });

    return result.data;
  } catch (error) {
    logger.error('Failed to query ComfyUI image status', {
      error: (error as Error).message,
      generateUuid,
    });
    return `Failed to query ComfyUI image status: ${error as string}`;
  }
}

export interface AdditionalNetwork {
  modelId: string;
  weight: number; // lora权重，范围 -4.0 ~ +4.0
}

// 添加 PromptAdapter 类型定义
type PromptAdapter<T> = (args: T, defaultArgs?: T) => string;

export function qwenToolGenerator<T extends z.AnyZodObject>(options: {
  name: string;
  description: string;
  parameters: T;
  defaultHeight?: number;
  defaultWidth?: number;
  promptAdapter: PromptAdapter<z.infer<T>>;
  defaultParams?: z.infer<T>;
  additionalNetwork?: AdditionalNetwork[];
  enable8Step?: boolean;
}): Tool<any, T> {
  const {
    name,
    description,
    parameters,
    promptAdapter,
    defaultParams,
    defaultHeight,
    defaultWidth,
    enable8Step = false,
  } = options;

  // 如果没有 width 或 height 字段，则添加默认的 number 类型字段
  const finalParameters = parameters.merge(
    z.object({
      width: z.number().optional().describe('图片宽度'),
      height: z.number().optional().describe('图片高度'),
    })
  ) as T;

  return {
    name,
    description,
    parameters: finalParameters || parameters,
    execute: async (args, context) => {
      const { log } = context;
      const logger = useLogger(log);

      try {
        // 使用 promptAdapter 生成最终的 prompt
        const finalPrompt = promptAdapter(args, defaultParams);

        logger.info('Generating image with Qwen', {
          inputArgs: args,
          finalPrompt,
        });

        // 提取 width 和 height 参数（如果存在）
        const width = 'width' in args ? (args.width as number) : undefined;
        const height = 'height' in args ? (args.height as number) : undefined;

        // 调用文生图接口，传递 width 和 height（如果提供了的话）
        const generateUuid = await invokeTextToImageByQwen({
          prompt: finalPrompt,
          width: width ?? defaultWidth,
          height: height ?? defaultHeight,
          enable8Steps: enable8Step,
        });

        logger.info('Image generation task submitted', {
          generateUuid,
        });

        return JSON.stringify({
          generateUuid,
          message: 'Image generation task submitted successfully',
        });
      } catch (error) {
        logger.error('Failed to generate image with Qwen', {
          error: (error as Error).message,
        });
        return `Failed to generate image: ${(error as Error).message}`;
      }
    },
  };
}

export interface TextToImageParams {
  // 必填参数
  prompt: string;
  // 可选参数 (允许用户传入)
  negativePrompt?: string;
  width?: number;
  height?: number;
  // Lora添加，最多5个
  additionalNetwork?: AdditionalNetwork[];
  enable8Steps?: boolean;
}

interface TextToImageResponse {
  code: number;
  data: {
    generateUuid: string;
  };
  msg: string;
}

/**
 *  使用千问模型调用文生图接口
 * @param request 请求参数
 * @returns Promise<string> 返回生成任务的UUID
 */
export async function invokeTextToImageByQwen(
  params: TextToImageParams
): Promise<string> {
  const logger = useLogger();

  try {
    // 从环境变量获取认证信息
    const accessKey = process.env.LIB_ACCESS_KEY;
    const secretKey = process.env.LIB_SECRET_KEY;

    if (!accessKey || !secretKey) {
      throw new Error(
        'Missing LIB_ACCESS_KEY or LIB_SECRET_KEY environment variables'
      );
    }

    // 构建完整的参数对象，仅允许特定参数由用户传入，其余使用固定默认值
    const finalParams = {
      checkPointId: '75e0be0c93b34dd8baeec9c968013e0c',
      prompt: params.prompt,
      negativePrompt:
        params.negativePrompt ||
        'ng_deepnegative_v1_75t,(badhandv4:1.2),EasyNegative,(worst quality:2),nsfw',
      clipSkip: 2,
      sampler: 1,
      steps: params.enable8Steps ? 8 : 30,
      cfgScale: 4.0,
      width: params.width || 768,
      height: params.height || 1024,
      imgCount: 1,
      randnSource: 0,
      seed: -1,
      additionalNetwork: [
        ...(params.additionalNetwork ? params.additionalNetwork : []),
        ...(params.enable8Steps
          ? [{ modelId: 'f482cb13b2ba476d9d954d09d617259f', weight: 0.4 }]
          : []),
      ],
    };

    // 构建带认证参数的URL
    const path = '/api/generate/webui/text2img';
    const authUrl = buildAuthUrl(path, accessKey, secretKey);
    const body = {
      templateUuid: 'bf085132c7134622895b783b520b39ff',
      generateParams: finalParams,
    };

    logger.info('authUrl', authUrl);
    logger.info('body', JSON.stringify(body));

    // 发送请求
    const response = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const result = (await response.json()) as TextToImageResponse;
    logger.info('Text to image invoked successfully', {
      statusCode: response.status,
      result: String(result),
    });

    if (result.code !== 0 || !result.data) {
      throw new Error(`API Error: ${result.msg}`);
    }
    return result.data.generateUuid;
  } catch (error) {
    logger.error('Failed to invoke text to image', {
      error: (error as Error).message,
    });
    throw new Error(`Failed to invoke text to image: ${error as string}`);
  }
}
