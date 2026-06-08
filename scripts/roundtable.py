"""
🎙️ AI 圆桌派 — 投票决策工作流（Dify 云版）

用法：
    python roundtable.py "你的问题"
    python roundtable.py          # 交互模式

依赖：
    pip install requests
"""

import requests
import json
import os
import sys

# ========== 配置（已填好，开箱即用） ==========
API_KEY = "app-t40DHSq7nyad6bVkx1r1Sjyn"
BASE_URL = "https://api.dify.ai/v1"
# =============================================


class AIRoundtable:
    """AI 圆桌派 — 三位虚拟嘉宾为你出谋划策"""

    def __init__(self, api_key: str = None, base_url: str = None):
        self.api_key = api_key or API_KEY
        self.base_url = (base_url or BASE_URL).rstrip('/')
        self.headers = {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json"
        }

    def discuss(self, question: str):
        """发起圆桌讨论，返回结果文本"""
        url = f"{self.base_url}/workflows/run"
        payload = {
            "inputs": {"user_question": question},
            "response_mode": "blocking",
            "user": "roundtable-script"
        }
        resp = requests.post(url, headers=self.headers, json=payload, timeout=120)
        resp.raise_for_status()
        data = resp.json()
        if data.get("data", {}).get("status") == "failed":
            raise RuntimeError(f"工作流执行失败: {data['data'].get('error', '未知错误')}")
        outputs = data["data"]["outputs"]
        return outputs.get("result", str(outputs))

    def discuss_stream(self, question: str):
        """发起圆桌讨论（流式输出），实时打印讨论过程"""
        url = f"{self.base_url}/workflows/run"
        payload = {
            "inputs": {"user_question": question},
            "response_mode": "streaming",
            "user": "roundtable-script"
        }
        resp = requests.post(url, headers=self.headers, json=payload, stream=True, timeout=120)
        final_output = None
        print("\n⏳ 圆桌讨论中，实时输出如下：\n")
        for line in resp.iter_lines(decode_unicode=True):
            if line:
                line = line.lstrip("data:").strip()
                if not line:
                    continue
                try:
                    data = json.loads(line)
                    event = data.get("event")
                    if event == "workflow_finished":
                        outputs = data.get("data", {}).get("outputs", {})
                        final_output = outputs.get("result", str(outputs))
                    elif event == "text_chunk":
                        print(data.get("data", {}).get("text", ""), end="", flush=True)
                except json.JSONDecodeError:
                    pass
        print()
        return final_output


def print_result(text: str):
    print("\n" + "=" * 60)
    print(text)
    print("=" * 60)


def interactive_mode():
    print("\n🎙️  AI 圆桌派（投票决策版）")
    print("输入你的问题，让三位虚拟嘉宾为你出谋划策！")
    print("输入 'exit' 或 'quit' 结束讨论。\n")
    rt = AIRoundtable()
    while True:
        try:
            question = input("❓ 你的问题：").strip()
            if question.lower() in ("exit", "quit"):
                print("👋 再见！")
                break
            if not question:
                continue
            print("\n🤔 正在召集嘉宾…")
            result = rt.discuss(question)
            print_result(result)
        except KeyboardInterrupt:
            print("\n👋 再见！")
            break
        except Exception as e:
            print(f"⚠️ 出错：{e}")


def main():
    if len(sys.argv) > 1:
        question = " ".join(sys.argv[1:])
        print(f"🤔 提问：{question}\n")
        rt = AIRoundtable()
        try:
            result = rt.discuss(question)
            print_result(result)
        except Exception as e:
            print(f"⚠️ 出错：{e}")
    else:
        interactive_mode()


if __name__ == "__main__":
    main()
