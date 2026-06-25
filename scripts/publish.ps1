param(
  [string]$Message = "chore: publish updates",
  [string]$RemoteUrl = "https://github.com/loinnn/pet-growth-diary.git",
  [string]$Branch = "main"
)

$ErrorActionPreference = "Stop"

$ProjectRoot = (Resolve-Path (Join-Path $PSScriptRoot "..")).Path
$GitCandidates = @(
  $env:GIT_EXE,
  "D:\Git\cmd\git.exe",
  "D:\Git\bin\git.exe",
  "git"
) | Where-Object { $_ }

$Git = $null
foreach ($Candidate in $GitCandidates) {
  try {
    & $Candidate --version | Out-Null
    $Git = $Candidate
    break
  } catch {
    continue
  }
}

if (-not $Git) {
  throw "Git was not found. Put Portable Git in D:\Git or set GIT_EXE."
}

Set-Location -LiteralPath $ProjectRoot

Write-Host "Using Git: $Git"
Write-Host "Project: $ProjectRoot"

if (-not (Test-Path -LiteralPath ".git")) {
  & $Git init -b $Branch
}

& $Git config user.name "loinnn"
& $Git config user.email "loinnn@users.noreply.github.com"

$CurrentBranch = (& $Git branch --show-current).Trim()
if (-not $CurrentBranch) {
  & $Git checkout -B $Branch
} elseif ($CurrentBranch -ne $Branch) {
  & $Git branch -M $Branch
}

$HasOrigin = ((& $Git remote) -contains "origin")

if ($HasOrigin) {
  & $Git remote set-url origin $RemoteUrl
} else {
  & $Git remote add origin $RemoteUrl
}

$OriginUrl = (& $Git remote get-url origin).Trim()
if ($OriginUrl -ne $RemoteUrl) {
  throw "Origin remote was not configured correctly."
}

Write-Host "Running lint..."
npm run lint
if ($LASTEXITCODE -ne 0) { throw "Lint failed." }

Write-Host "Running build..."
npm run build
if ($LASTEXITCODE -ne 0) { throw "Build failed." }

$IgnoredPaths = @(".npm-cache", "node_modules", "dist", "build", "coverage")
foreach ($IgnoredPath in $IgnoredPaths) {
  & $Git rm --cached -r --ignore-unmatch $IgnoredPath | Out-Null
}

& $Git add .
if ($LASTEXITCODE -ne 0) { throw "Git add failed." }

$Status = (& $Git status --porcelain)
if (-not $Status) {
  Write-Host "No new changes to publish."
  exit 0
}

try {
  & $Git commit -m $Message
  if ($LASTEXITCODE -ne 0) { throw "Git commit failed." }
} catch {
  throw
}

Write-Host "Pushing to $RemoteUrl ..."
& $Git push -u origin $Branch
if ($LASTEXITCODE -ne 0) { throw "Git push failed." }

Write-Host "Publish finished. GitHub Pages will update after GitHub Actions completes."
