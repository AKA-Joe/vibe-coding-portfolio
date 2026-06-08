#!/usr/bin/env python3
"""
多模型 API 稳定性测试脚本
用法：
  python stability_monitor.py --url https://your-proxy.com --key sk-xxx --models gpt-4o-mini,gpt-4o --requests 30 --concurrency 5
"""

import time
import statistics
import concurrent.futures
import requests
import argparse
import json
import sys
from datetime import datetime, timezone
from typing import List, Dict, Any

# 默认配置
DEFAULT_URL = "https://api.openai.com/v1/chat/completions"
DEFAULT_MODELS = ["gpt-4o-mini"]
DEFAULT_REQUESTS = 30
DEFAULT_CONCURRENCY = 5
DEFAULT_TIMEOUT = 60  # 单次请求超时（秒）
TEST_PROMPT = "Hello, this is a stability test. Please reply with 'OK'."


def send_request(request_id: int, model: str, api_url: str, api_key: str, timeout: int) -> Dict[str, Any]:
    """发送一次请求并记录结果"""
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    payload = {
        "model": model,
        "messages": [{"role": "user", "content": TEST_PROMPT}],
        "max_tokens": 10,
        "temperature": 0
    }

    start = time.time()
    error_type = None
    error_msg = None
    status_code = None
    success = False

    try:
        resp = requests.post(api_url, json=payload, headers=headers, timeout=timeout)
        elapsed = time.time() - start
        status_code = resp.status_code
        if status_code == 200:
            success = True
        else:
            error_type = f"HTTP {status_code}"
            error_msg = resp.text[:200]
    except requests.exceptions.Timeout:
        elapsed = time.time() - start
        error_type = "Timeout"
        error_msg = f"Request timed out after {timeout}s"
    except requests.exceptions.ConnectionError as e:
        elapsed = time.time() - start
        error_type = "ConnectionError"
        error_msg = str(e)[:200]
    except Exception as e:
        elapsed = time.time() - start
        error_type = "Unknown"
        error_msg = str(e)[:200]

    return {
        "id": request_id,
        "model": model,
        "success": success,
        "latency": elapsed,
        "status_code": status_code,
        "error_type": error_type,
        "error_msg": error_msg
    }


def test_model(model: str, api_url: str, api_key: str, total: int, concurrency: int, timeout: int) -> List[Dict[str, Any]]:
    """测试单个模型，返回所有请求结果"""
    results = []
    print(f"\n{'='*60}")
    print(f"🔍 开始测试模型: {model}  (请求数: {total}, 并发: {concurrency})")
    print(f"{'='*60}")

    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = {executor.submit(send_request, i, model, api_url, api_key, timeout): i for i in range(total)}
        for future in concurrent.futures.as_completed(futures):
            res = future.result()
            results.append(res)
            # 实时输出进度
            icon = "✅" if res["success"] else "❌"
            print(f"  [{icon}] 请求 #{res['id']:03d}  |  延迟: {res['latency']:.2f}s  |  {res.get('status_code', 'ERR')}")

    return results


def generate_report(all_results: Dict[str, List[Dict[str, Any]]], total_time: float, output_file: str = None):
    """生成并打印测试报告，同时保存到文件"""
    lines = []
    lines.append("# 🌐 API 稳定性测试报告")
    lines.append(f"**测试时间**: {datetime.now(timezone.utc).strftime('%Y-%m-%d %H:%M:%S UTC')}")
    lines.append(f"**总耗时**: {total_time:.2f}s")
    lines.append("")

    summary_table = "| 模型 | 请求数 | 成功数 | 成功率 | 平均延迟 | P50 | P95 | P99 | 最小 | 最大 |"
    summary_table += "\n|------|--------|--------|--------|----------|-----|-----|-----|------|------|"
    lines.append(summary_table)

    for model, results in all_results.items():
        total = len(results)
        success = [r for r in results if r["success"]]
        failed = total - len(success)
        success_rate = (len(success) / total * 100) if total > 0 else 0

        latencies = sorted([r["latency"] for r in results])
        avg_lat = statistics.mean(latencies) if latencies else 0
        min_lat = min(latencies) if latencies else 0
        max_lat = max(latencies) if latencies else 0
        p50 = latencies[int(len(latencies) * 0.5)] if len(latencies) > 0 else 0
        p95 = latencies[int(len(latencies) * 0.95)] if len(latencies) >= 20 else max_lat
        p99 = latencies[int(len(latencies) * 0.99)] if len(latencies) >= 10 else max_lat

        lines.append(
            f"| {model} | {total} | {len(success)} | {success_rate:.1f}% | {avg_lat:.2f}s | {p50:.2f}s | {p95:.2f}s | {p99:.2f}s | {min_lat:.2f}s | {max_lat:.2f}s |"
        )

        # 错误详情
        if failed > 0:
            error_types = {}
            for r in results:
                if not r["success"]:
                    err = r.get("error_type", "Unknown")
                    error_types[err] = error_types.get(err, 0) + 1
            lines.append(f"\n**{model} 错误分布**:")
            for err_type, count in error_types.items():
                lines.append(f"- {err_type}: {count} 次")

    report_text = "\n".join(lines)

    # 控制台输出
    print("\n" + report_text)

    # 保存 Markdown 文件
    if output_file:
        with open(output_file, "w", encoding="utf-8") as f:
            f.write(report_text)
        print(f"\n📄 报告已保存至: {output_file}")

    # 同时保存 JSON 原始结果
    json_file = output_file.replace(".md", ".json") if output_file else "stability_results.json"
    with open(json_file, "w", encoding="utf-8") as f:
        json.dump(all_results, f, indent=2, ensure_ascii=False)
    print(f"📄 原始数据已保存至: {json_file}")


def main():
    parser = argparse.ArgumentParser(description="多模型 API 稳定性测试工具")
    parser.add_argument("--url", required=True, help="API 地址，例如 https://your-proxy.com/v1/chat/completions")
    parser.add_argument("--key", required=True, help="API Key")
    parser.add_argument("--models", required=True, help="模型名称，逗号分隔，例如 'gpt-4o-mini,gpt-4o'")
    parser.add_argument("--requests", type=int, default=DEFAULT_REQUESTS, help="每个模型测试次数 (默认 30)")
    parser.add_argument("--concurrency", type=int, default=DEFAULT_CONCURRENCY, help="并发数 (默认 5)")
    parser.add_argument("--timeout", type=int, default=DEFAULT_TIMEOUT, help="单次请求超时秒数 (默认 60)")
    parser.add_argument("--output", default=None, help="报告文件前缀，自动生成 .md 和 .json 文件")

    args = parser.parse_args()

    models = [m.strip() for m in args.models.split(",") if m.strip()]
    if not models:
        print("❌ 错误: 至少指定一个模型")
        sys.exit(1)

    output_prefix = args.output or f"stability_report_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
    report_md = output_prefix + ".md"

    print("=" * 60)
    print("🚀 多模型稳定性测试启动")
    print(f"   API 地址: {args.url}")
    print(f"   模型列表: {', '.join(models)}")
    print(f"   每模型请求数: {args.requests}")
    print(f"   并发数: {args.concurrency}")
    print(f"   超时设置: {args.timeout}s")
    print("=" * 60)

    start_time = time.time()
    all_results = {}

    for model in models:
        results = test_model(model, args.url, args.key, args.requests, args.concurrency, args.timeout)
        all_results[model] = results

    total_time = time.time() - start_time
    generate_report(all_results, total_time, report_md)


if __name__ == "__main__":
    main()