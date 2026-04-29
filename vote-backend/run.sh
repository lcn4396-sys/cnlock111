#!/bin/sh
# Linux 启动脚本（后端 API）。用法: ./run.sh 或 bash run.sh
# 请勿用 node 运行本文件；Windows 请用 run.ps1

set -e
cd "$(dirname "$0")"

# 可选：未设置 JAVA_HOME 时从 java 命令推导
if [ -z "$JAVA_HOME" ] && command -v java >/dev/null 2>&1; then
  _java="$(command -v java)"
  _bin="$(dirname "$_java")"
  JAVA_HOME="$(cd "$_bin/.." && pwd)"
  export JAVA_HOME
  echo "Using JAVA_HOME: $JAVA_HOME"
fi

if ! command -v java >/dev/null 2>&1; then
  echo "ERROR: Java not found. Please set JAVA_HOME or add java to PATH (JDK 11+)."
  exit 1
fi

if command -v mvn >/dev/null 2>&1; then
  echo "Using Maven from PATH..."
  exec mvn spring-boot:run "$@"
fi

if [ -f ./mvnw ] && [ -x ./mvnw ]; then
  echo "Using ./mvnw..."
  exec ./mvnw spring-boot:run "$@"
fi

echo "ERROR: Maven not found. Install Maven and add mvn to PATH, or add Maven Wrapper (mvnw) to this project."
exit 1
