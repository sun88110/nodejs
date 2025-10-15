# 🧱 Git 기본 명령어 요약표

Git의 주요 명령어를 설정, 버전관리, 브랜치, 원격 저장소 관리 순서대로 정리했습니다.

---

## ⚙️ 1. 기본 설정

| 명령어 | 설명 |
|--------|------|
| `git config --global user.name "이름"` | 커밋에 표시될 사용자 이름 설정 |
| `git config --global user.email "이메일주소"` | 커밋에 표시될 이메일 설정 |
| `git config --list` | 현재 설정된 Git 환경 확인 |
| `git help` | 명령어 도움말 확인 |

---

## 📁 2. 저장소 생성 및 연결

| 명령어 | 설명 |
|--------|------|
| `git init` | 현재 폴더를 Git 로컬 저장소로 초기화 |
| `git clone <URL>` | 원격 저장소 복제 (깃허브 등에서 가져오기) |
| `git remote add origin <URL>` | 원격 저장소(origin) 연결 |
| `git remote -v` | 연결된 원격 저장소 주소 확인 |

---

## 📝 3. 버전 관리 기본 흐름

| 명령어 | 설명 |
|--------|------|
| `git status` | 현재 상태 확인 (수정, 스테이징, 커밋 상태 등) |
| `git add <파일명>` | 파일을 스테이징 영역에 추가 |
| `git add .` | 모든 변경 파일을 스테이징 |
| `git commit -m "커밋 메시지"` | 스테이징된 파일을 커밋 |
| `git log` | 커밋 히스토리 확인 |
| `git diff` | 변경된 내용 비교 |
| `git restore <파일명>` | 수정한 파일 되돌리기 (최근 커밋 기준) |
| `git reset <파일명>` | 스테이징 취소 |

---

## 🌿 4. 브랜치 관리

| 명령어 | 설명 |
|--------|------|
| `git branch` | 브랜치 목록 보기 |
| `git branch <브랜치명>` | 새 브랜치 생성 |
| `git checkout <브랜치명>` | 브랜치 이동 |
| `git checkout -b <브랜치명>` | 브랜치 생성 + 이동 동시에 |
| `git merge <브랜치명>` | 다른 브랜치를 현재 브랜치에 병합 |
| `git branch -d <브랜치명>` | 브랜치 삭제 |

---

## ☁️ 5. 원격 저장소 (GitHub 등)

| 명령어 | 설명 |
|--------|------|
| `git push origin <브랜치명>` | 커밋을 원격 저장소로 업로드 |
| `git pull origin <브랜치명>` | 원격 저장소 변경 내용을 로컬로 가져오기 |
| `git fetch` | 원격 저장소의 최신 정보를 가져오되 병합은 안 함 |
| `git clone <URL>` | 원격 저장소 복제 |

---

## 🔄 6. 되돌리기 & 정리

| 명령어 | 설명 |
|--------|------|
| `git revert <커밋ID>` | 특정 커밋의 변경사항을 되돌리는 새 커밋 생성 |
| `git reset --hard <커밋ID>` | 특정 시점으로 완전히 되돌리기 *(주의!)* |
| `git clean -fd` | 추적되지 않은 파일/폴더 제거 |
| `git stash` | 현재 작업 내용을 임시 저장 |
| `git stash pop` | 임시 저장된 작업 복원 |

---

## 🔍 7. 전체 흐름 예시

```bash
git init
git add .
git commit -m "first commit"
git branch dev
git checkout dev
git merge dev
git remote add origin <URL>
git push origin main
```

---

> ✅ **Tip:**  
> - `git log --oneline --graph` : 브랜치 구조를 한눈에 보기  
> - `git status` 는 습관적으로 자주 확인하기  
> - `git pull` 하기 전에 반드시 `git commit` 으로 변경사항 정리하기  

