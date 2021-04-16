interface ValidatorHandler {
  (val: string | number): boolean
}

interface ValidatorParam {
  handler: boolean
  errorMsg: string
}

export const megeValidator = (list: ValidatorParam[]): string => {
  let msg = ''
  list.find(item => {
    if (item.handler) {
      msg = item.errorMsg
      return true
    }
  })
  return msg
}

/**
 * 电话号码
*/
export const phoneValidator: ValidatorHandler = (val) => {
  return /^1[0-9]{10}$/.test(val as string)
}

/**
 * 邮箱
*/
export const mailValidator: ValidatorHandler = (val) => {
  return /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/.test(val as string)
}

/**
 * 纯数字
*/
export const allNumberValidator: ValidatorHandler = (val) => {
  return /^\d{1,}$/.test(val as string)
}

/**
 * 小数点后两位
*/
export const twoDecimalValidator: ValidatorHandler = (val) => {
  return /^(([1-9]{1}\d*)|(0{1}))(\.\d{2})$/.test(val as string)
}

/**
 * 纯中文
*/
export const allChineseValidator: ValidatorHandler = (val) => {
  return /^[\u4e00-\u9fa5]{1,}$/.test(val as string)
}

/**
 * 包含中文
*/
export const hasChineseValidator: ValidatorHandler = (val) => {
  return /[\u4e00-\u9fa5]/.test(val as string)
}

/**
 * 是否有前后空格
*/
export const hasSideBlankValidator: ValidatorHandler = (val) => {
  return /^\s+|\s+$/.test(val as string)
}

/**
 * 是否为空字符串
*/
export const blankStringValidator: ValidatorHandler = (val) => {
  return !val || !(val as string).trim()
}

/**
 * 中文、字母、数字 组合
*/
export const chineseLetterNumberValidator: ValidatorHandler = (val) => {
  return /^[\u4e00-\u9fa5a-zA-Z0-9]+$/.test(val as string)
}

