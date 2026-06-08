"""
🔐 用户信息脱敏加密审查 — Dify 工作流（云版）

用法：
    python privacy_tool.py 姓名 手机号 [身份证号] [备注...]
    python privacy_tool.py     # 交互模式

依赖：
    pip install requests
"""

import requests
import os
import sys

# ========== 配置（已填好，开箱即用） ==========
API_KEY = "app-6jpOqIRzijnXDHs7UGIXEDP6"
BASE_URL = "https://api.dify.ai/v1"
# =============================================


class PrivacyTool:
    """用户信息脱敏加密审查"""

    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or API_KEY
        self.base_url = (base_url or BASE_URL).rstrip('/')
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def process(self, name: str, phone: str, id_card: str = "", remark: str = "") -> str:
        """
        提交敏感信息进行脱敏、加密、审查。
        返回处理结果文本。
        """
        url = f"{self.base_url}/workflows/run"
        payload = {
            "inputs": {
                "name": name,
                "phone": phone,
                "id_card": id_card,
                "remark": remark
            },
            "response_mode": "blocking",
            "user": "privacy-tool"
        }
        resp = requests.post(url, headers=self.headers, json=payload, timeout=90)
        resp.raise_for_status()
        data = resp.json()
        if data.get("data", {}).get("status") == "failed":
            raise RuntimeError(f"工作流执行失败: {data['data'].get('error', '未知错误')}")
        outputs = data["data"]["outputs"]
        return outputs.get("output", str(outputs))


def print_result(text: str):
    print("\n" + "=" * 60)
    print("🔐 脱敏加密审查结果：")
    print("=" * 60)
    print(text)
    print("=" * 60)


def interactive_mode():
    print("\n🔒 用户信息脱敏加密审查工具")
    print("请依次输入需要处理的信息\n")
    tool = PrivacyTool()
    while True:
        try:
            name = input("👤 姓名：").strip()
            if name.lower() in ("exit", "quit"):
                print("👋 再见！")
                break
            if not name:
                print("⚠️ 姓名不能为空")
                continue
            phone = input("📱 手机号：").strip()
            if not phone:
                print("⚠️ 手机号不能为空")
                continue
            id_card = input("🆔 身份证号（可选）：").strip()
            remark = input("📝 备注（可选）：").strip()
            print("\n⏳ 正在处理…")
            result = tool.process(name, phone, id_card, remark)
            print_result(result)
        except KeyboardInterrupt:
            print("\n👋 再见！")
            break
        except Exception as e:
            print(f"⚠️ 出错：{e}")


def main():
    if len(sys.argv) >= 3:
        name = sys.argv[1]
        phone = sys.argv[2]
        id_card = sys.argv[3] if len(sys.argv) > 3 else ""
        remark = " ".join(sys.argv[4:]) if len(sys.argv) > 4 else ""
        print(f"👤 姓名：{name}")
        print(f"📱 手机号：{phone}")
        if id_card:
            print(f"🆔 身份证号：{id_card}")
        if remark:
            print(f"📝 备注：{remark}")
        print("\n⏳ 正在处理…")
        tool = PrivacyTool()
        try:
            result = tool.process(name, phone, id_card, remark)
            print_result(result)
        except Exception as e:
            print(f"⚠️ 出错：{e}")
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
