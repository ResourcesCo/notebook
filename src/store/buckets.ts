import { reactive } from 'vue'
import cloneDeep from 'lodash/cloneDeep'

interface Bucket {
  name: string;
  local: string;
  web?: string;
  virtual: {};
}

interface BucketProps {
  local: string;
  web?: string;
}

interface BucketStoreStatus {
  loaded: boolean,
}

function deserialize(name: string, { local, web }: BucketProps) {
  return {
    name,
    local,
    web,
    virtual: {},
  }
}

function serialize({ local, web }: Bucket) {
  return {
    local,
    web,
  }
}

const defaultBuckets = {
  'notebook-docs': {
    local: 'nb:notebook-docs',
    web: '/notebook-docs',
  },
  docs: {
    local: 'nb:docs',
  }
}

export const buckets: { [key: string]: Bucket } = reactive({})
export const bucketStoreStatus: BucketStoreStatus = reactive({ loaded: false })

function getStorageItem(key: string): any {
  const data = localStorage.getItem(key)
  if (data) {
    try {
      const parsed = JSON.parse(data)
      return parsed
    } catch (err) {
      // do nothing
    }
  }
}

export function load() {
  let bucketData: { [key: string]: BucketProps } | undefined = getStorageItem('nb:_buckets')
  if (!bucketData) {
    bucketData = cloneDeep(defaultBuckets)
  }
  if (bucketData) {
    for (const key of Object.keys(bucketData)) {
      buckets[key] = deserialize(key, bucketData[key])
    }
  }
  bucketStoreStatus.loaded = true
}

export function save() {
  const bucketData: { [key: string]: BucketProps } = {}
  if (bucketStoreStatus.loaded) {
    for (const key of Object.keys(buckets)) {
      bucketData[key] = serialize(buckets[key])
    }
  }
  localStorage.setItem('nb:_buckets', JSON.stringify(bucketData))
}

export async function getObject(bucketName: string, key: string): Promise<any> {
  const bucket = buckets[bucketName]
  if (!bucket) {
    throw new Error('Bucket not found')
  }
  if (bucket.local) {

  }
}

export async function putObject(bucketName: string, key: string, data: any) {
  const bucket = buckets[bucketName]
  if (!bucket) {
    throw new Error('Bucket not found')
  }

}