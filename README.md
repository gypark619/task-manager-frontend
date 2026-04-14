
# Task Manager Frontend

## 📌 Overview

React 기반의 사용자 관리 UI 애플리케이션입니다.

백엔드 API와 연동하여 사용자 조회, 등록, 수정, 삭제 기능을 제공합니다.

---

## 🛠 Tech Stack

- React
- JavaScript (ES6+)
- Axios

---

## 📂 Structure

- pages: 화면 단위 컴포넌트
- components: 재사용 가능한 UI 컴포넌트
- api: API 통신 모듈

---

## 🚀 주요 기능

### 사용자 관리 UI
- 사용자 목록 조회
- 사용자 등록 / 수정 / 삭제

### 검색 및 필터링
- 이름, 부서, 직급, 상태 조건 검색
- 서버 API 기반 필터링

### 페이징
- 서버 페이징 데이터 기반 UI 구성

### 정렬
- 정렬 조건 선택 후 조회 시 반영

### 에러 처리
- API 응답 메시지 기반 토스트 알림 처리
- 공통 에러 메시지 처리 방식 적용

---

## 🔗 API

- Backend: http://localhost:8080

---

## ⚙️ Run

```bash
npm install
npm start