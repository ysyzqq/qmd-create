import request, {CommonResponse} from '@/utils/request';

export async function query(): Promise<any> {
  return request('/api/users');
}

export async function queryCurrent(): Promise<CommonResponse<{account: string, name: string, list: number[]}>> {
  // mock
  return {code: 0, data: {list: [1, 2], account: 'shengyu,yue', name: '岳生煜'}}
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}
