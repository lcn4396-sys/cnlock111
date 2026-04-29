# Start Spring Boot without Maven in PATH. Uses local Maven if needed. Usage: .\run.ps1

$ErrorActionPreference = "Stop"
$projectDir = $PSScriptRoot
$mavenDir = Join-Path $projectDir ".mvn\maven"
$mavenVersion = "3.9.6"
$mavenZipUrl = "https://repo.maven.apache.org/maven2/org/apache/maven/apache-maven/$mavenVersion/apache-maven-$mavenVersion-bin.zip"
$mavenZip = Join-Path $projectDir ".mvn\apache-maven-$mavenVersion-bin.zip"
$mvnCmd = Join-Path $mavenDir "apache-maven-$mavenVersion\bin\mvn.cmd"

# 若 JAVA_HOME 未设置或无效，尝试从 PATH 或常见路径检测并设置
function Set-JavaHomeIfNeeded {
    if ($env:JAVA_HOME -and (Test-Path (Join-Path $env:JAVA_HOME "bin\java.exe"))) { return }
    $javaExe = $null
    try { $javaExe = (Get-Command java -ErrorAction Stop).Source } catch {}
    if ($javaExe) {
        $env:JAVA_HOME = Split-Path (Split-Path $javaExe -Parent) -Parent
        Write-Host "Using JAVA_HOME: $env:JAVA_HOME"
        return
    }
    $roots = @("C:\Program Files\Java", "C:\Program Files\Eclipse Adoptium", "C:\Program Files\Microsoft", "C:\Program Files\Amazon Corretto")
    foreach ($root in $roots) {
        if (-not (Test-Path $root)) { continue }
        $dirs = Get-ChildItem -Path $root -Directory -ErrorAction SilentlyContinue
        foreach ($d in $dirs) {
            $j = Join-Path $d.FullName "bin\java.exe"
            if (Test-Path $j) {
                $env:JAVA_HOME = $d.FullName
                Write-Host "Using JAVA_HOME: $env:JAVA_HOME"
                return
            }
        }
    }
    Write-Host "ERROR: Java not found. Please set JAVA_HOME or add java to PATH (e.g. install JDK 11+)."
    exit 1
}
Set-JavaHomeIfNeeded

# 1. Prefer mvn in PATH
$mvnInPath = Get-Command mvn -ErrorAction SilentlyContinue
if ($mvnInPath)
{
    Write-Host "Using Maven from PATH..."
    Set-Location $projectDir
    & mvn spring-boot:run @args
    exit $LASTEXITCODE
}

# 2. Use local Maven if already present
if (Test-Path $mvnCmd)
{
    Write-Host "Starting Spring Boot (local Maven)..."
    Set-Location $projectDir
    & $mvnCmd spring-boot:run @args
    exit $LASTEXITCODE
}

# 3. Download and extract Maven
Write-Host "Maven not found. Downloading Maven $mavenVersion (one-time)..."
$mavenParent = Split-Path $mavenDir -Parent
if (-not (Test-Path $mavenParent)) { New-Item -ItemType Directory -Force -Path $mavenParent | Out-Null }

try
{
    Invoke-WebRequest -Uri $mavenZipUrl -OutFile $mavenZip -UseBasicParsing
}
catch
{
    Write-Host "Download failed. Check network or install Maven and add to PATH."
    exit 1
}

Expand-Archive -Path $mavenZip -DestinationPath $mavenDir -Force
Remove-Item $mavenZip -Force -ErrorAction SilentlyContinue

if (-not (Test-Path $mvnCmd))
{
    Write-Host "Maven extract failed. Expected: $mvnCmd"
    exit 1
}

Write-Host "Starting Spring Boot..."
Set-Location $projectDir
& $mvnCmd spring-boot:run @args
exit $LASTEXITCODE
