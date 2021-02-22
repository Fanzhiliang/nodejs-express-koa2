module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    // 不让使用废弃接口
    'node/no-deprecated-api': 0,
    // 代码缩进
    indent: [
      2,
      2,
      {
        SwitchCase: 1
      }
    ],
    // 未被使用
    'no-unused-vars': [1]
  }
}
