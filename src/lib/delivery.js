import config from '../../config/delivery.mjs';

export function resolveDelivery(env = process.env) {
  const mode = env.MG_SHELL_MODE || config.mode;
  if (!['navigation', 'content'].includes(mode)) throw new Error('MG_SHELL_MODE must be navigation or content');
  const navigation = { ...config.navigation };
  for (const key of ['sourceUrl', 'actionUrl']) {
    const url = new URL(navigation[key]);
    if (url.origin !== 'https://mgmotor.com.au' || url.username || url.password) throw new Error(`Invalid navigation ${key}`);
  }
  if (!(navigation.timeoutMs > 0 && navigation.timeoutMs <= 15000)) throw new Error('Invalid navigation timeout');
  if (typeof navigation.enabled !== 'boolean' || !Number.isInteger(navigation.maxResponseBytes) || navigation.maxResponseBytes < 10000 || navigation.maxResponseBytes > 5000000) throw new Error('Invalid navigation limits');
  return { mode, navigation };
}

export const delivery = resolveDelivery();
