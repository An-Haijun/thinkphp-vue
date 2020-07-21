import Fetch from '../base'

const fetch = new Fetch

// 获取交易合同 pdf 展示
const GET_CONTRACT_FILE = 'merchant/Financial/getOneContractImg'
const GET_TRAN_CONTRACT_FILE = 'merchant/Financial/getContractImg'
const GET_POUND_CERTIFICATE_LIST = 'merchant/Financial/certificateHistoryList'


// 全局私有变量
// const config = {}

class FetchCommon {
  constructor() { }

  getContractFIle(options = {}) {
    const data = options.data || ''
    return fetch.post({
      url: GET_CONTRACT_FILE,
      data: data
    })
  }

  getTranContractFile(options = {}) {
    const data = options.data || ''
    return fetch.post({
      url: GET_TRAN_CONTRACT_FILE,
      data: data
    })
  }

  /**
   * 
   * @param {certificate_no: '凭证编号', type: '图片类型'} options 
   * certificate_no: 货物榜单、合格证(申请流水号)
   * type: 货物榜单：GoodsPoundList；合格证书：GoodsCertificate
   */
  getPoundCertificateList(options = {}) {
    const data = options.data || ''
    return fetch.post({
      url: GET_POUND_CERTIFICATE_LIST,
      data: data
    })
  }
}

export default FetchCommon