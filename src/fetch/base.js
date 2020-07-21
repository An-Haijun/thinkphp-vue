function createFormItem(key, val) {
  const itemEl = document.createElement('input')
  itemEl.setAttribute('name', key)
  itemEl.setAttribute('value', val)
  return itemEl
}

const responseData = function (options = {}, type = '') {
  const data = {
    success: options.success || false,
    error_msg: options.error_msg || '请求异常，请稍后再试',
    error_code: options.error_code || 1,
    result: options.result || ''
  }
  let res = {}
  if (type === 'error') {
    res = data
  } else {
    res['raw'] = data
    res['data'] = data.result
  }
  return res
}

const instance = axios.create({
  baseURL: '/public/',
  timeout: 300000,
  // headers: ''
})

instance.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(responseData({
    error_code: error.request.status
  }, 'error'))
})

instance.interceptors.response.use(response => {
  const { status, data } = response
  if (status >= 200 && status < 400) {
    if (data && data.success) {
      return responseData({
        success: true,
        error_msg: data.error_msg || '请求成功',
        error_code: 0,
        result: data.result
      })
    }
    return responseData({
      error_msg: data.error_msg || '',
      error_code: data.error_code || ''
    })
  }
  return responseData({
    error_code: status
  })
}, error => {
  return Promise.reject(responseData({
    error_code: error.response.status
  }, 'error'))
})

class Fetch {
  constructor() { }

  post(options = {}) {
    const url = options.url || '',
      data = options.data || {},
      config = options.config || {}
    return instance({ url, method: 'POST', data })
  }

  get(options = {}) {
    const url = options.url || '',
      data = {
        params: options.data || ''
      },
      config = options.config || {}
    return instance.post(url, data)
  }

  upload(options = {}) {
    const url = options.url || '',
      data = options.data || {},
      config = options.config || {},
      headers = {
        'Content-Type': 'multipart/form-data;'
      }
    return instance({ url, method: 'POST', data, headers })
  }

  form(options = {}) {
    console.log(options)
    const formEl = document.createElement('form')
    formEl.action = options.url
    formEl.setAttribute('method', 'post')
    formEl.setAttribute('id', 'formSubmitId')
    options.target && formEl.setAttribute('target', options.target)
    for (let key in options.params) {
      formEl.appendChild(createFormItem(key, options.params[key]))
    }
    document.body.appendChild(formEl);
    formEl.submit();
    // document.body.removeChild(formEl);
  }
}

export default Fetch