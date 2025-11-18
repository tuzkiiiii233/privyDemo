# 自定义钱包连接指南

## 概述

这个方案允许你在移动 app 的 WebView 中连接 app 内置钱包，并通过 SIWE (Sign-In with Ethereum) 验证连接。

## 使用步骤

### 1. 访问钱包连接页面

在你的移动 app 中打开：

```
https://your-domain.com/wallet-connect
```

或本地开发：

```
https://localhost:3000/wallet-connect
```

### 2. App 端需要注入钱包对象

你的移动 app 需要在 WebView 中注入一个 `window.ethereum` 对象，实现以下方法：

```javascript
window.ethereum = {
  // 请求账户访问
  request: async ({ method, params }) => {
    if (method === "eth_requestAccounts") {
      // 返回钱包地址数组
      return ["0x..."];
    }

    if (method === "personal_sign") {
      // params[0] 是要签名的消息
      // params[1] 是签名地址
      const [message, address] = params;

      // 使用 app 内置钱包签名
      const signature = await yourAppWallet.sign(message);
      return signature;
    }
  },
};
```

### 3. SIWE 验证流程

1. 用户点击"连接 App 钱包"
2. 调用 `eth_requestAccounts` 获取地址
3. 创建 SIWE 消息
4. 调用 `personal_sign` 请求签名
5. 验证签名成功后，用户登录

### 4. 后端验证（可选）

如果需要在后端验证签名，可以调用 API：

```typescript
const response = await fetch("/api/verify-siwe", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    message: siweMessage.prepareMessage(),
    signature: signature,
  }),
});
```

## iOS WebView 示例

```swift
import WebKit

class WalletWebView: WKWebView {
    override init(frame: CGRect, configuration: WKWebViewConfiguration) {
        super.init(frame: frame, configuration: configuration)
        injectWallet()
    }

    func injectWallet() {
        let script = """
        window.ethereum = {
            request: async function({ method, params }) {
                return new Promise((resolve, reject) => {
                    window.webkit.messageHandlers.wallet.postMessage({
                        method: method,
                        params: params,
                        callback: 'resolve_' + Date.now()
                    });
                });
            }
        };
        """

        let userScript = WKUserScript(
            source: script,
            injectionTime: .atDocumentStart,
            forMainFrameOnly: false
        )

        configuration.userContentController.addUserScript(userScript)
    }
}
```

## Android WebView 示例

```kotlin
webView.addJavascriptInterface(WalletBridge(), "walletBridge")

class WalletBridge {
    @JavascriptInterface
    fun request(method: String, params: String): String {
        return when (method) {
            "eth_requestAccounts" -> {
                // 返回钱包地址
                """["0x..."]"""
            }
            "personal_sign" -> {
                // 签名消息
                val signature = wallet.sign(params)
                """"$signature""""
            }
            else -> ""
        }
    }
}
```

## 注意事项

1. 确保 HTTPS 连接（本地开发使用 mkcert）
2. SIWE 消息的 domain 和 uri 必须匹配当前网站
3. 签名必须使用 EIP-191 标准（personal_sign）
4. 建议在后端验证签名以确保安全性
