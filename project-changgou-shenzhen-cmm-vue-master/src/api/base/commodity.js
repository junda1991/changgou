import {createAPI} from '@/utils/request'
var urls = 'goods'
export const list = data => createAPI(`/spu/search/${data.page}/${data.pagesize}`, 'get', data)
export const listSerch = data => createAPI(`/spu/search/${data.page}/${data.pagesize}`, 'post', data)
export const listPhoto = data => createAPI(`/album`, 'get', data)
export const put = data => createAPI(`/spu/put/${data.id}`, 'put', data)
export const pull = data => createAPI(`/spu/pull/${data.id}`, 'put', data)
export const category = data => createAPI(`/category/list/${data.id}`, 'get', data)
export const brand = data => createAPI(`/brand/category/${data.id}`, 'get', data)
export const brandAll = data => createAPI(`/brand`, 'get', data)
export const template = data => createAPI(`/template`, 'get', data)
export const parameter = data => createAPI(`/para/category/${data.id}`, 'get', data)
export const commoditySpec = data => createAPI(`/spec/search`, 'post', data)
export const delectSpec = data => createAPI(`/spec`, 'delete', data)
export const addSpec = data => createAPI(`/spec`, 'post', data)
export const audit = data => createAPI(`/spu/audit/${data.id}`, 'put', data)
export const save = data => createAPI(`/spu/save`, 'post', data)
export const savemodify = data => createAPI(`/spu/save/${data.id}`, 'put', data)
export const remove = data => createAPI(`/spu/${data.id}`, 'delete', data)

export const detail = data => createAPI(`/spu/goods/${data.id}`, 'get', data)
export const photoalbum = data => createAPI(`/album/${data.id}`, 'get', data)
