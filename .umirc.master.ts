import { IConfig } from "umi-types";

const config: IConfig = {
  define: {
    "window.api": "http://api.supplier.tdianyi.com/",
    "window.open_id": "open_id",
    "window.url": "http://release.api.tdianyi.com/",
    "window.from": "http://supplier.tdianyi.com/",
    "window.pay_url": "http://api.tdianyi.com/payCentre/toSupplierWxPay"
  },
}

export default config