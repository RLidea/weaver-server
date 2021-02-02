# Weaver Framework: Server

## 주 기능

### 개발 환경
- Node.js 14 버전 이상 필요
- express 기반
- dotenv 를 이용한 환경변수 관리
- eslint 적용 및 규칙
- prettier 규칙

### 디자인 패턴 
- sequelize 이용한 ORM 관리
- Controller, Model, Router 의 분리

### 네트워크 및 인증
- CSRF 보호
- passport 기반 jwt 이용한 로그인 기능
- 회원별 접근 가능 메뉴 처리

### 관리 및 테스트
- 시스템 로그
- mocha 기반 테스트 환경
- common_code 테이블을 통해 시스템 설정 데이터 관리 

### 에러
- 시스템 에러 기능

### 기타
[comment]: <> (- 국제화 기능&#40;i18n&#41;)
- validate schema 이용
- Alias

updated_at: 2021-01-08


## 처음 프로젝트를 받았을 때

### 간편설치
```shell
$ chmod +x ./build.sh
$ npm run install
```
### 환경변수
`.env` 복사 후 필요시 자신의 환경에 맞게 수정
```shell script
$ cp .env-example .env
```
`JWT_SECRET_KEY`값을 생성해줍니다.
```shell script
ssh-keygen -t rsa -C "your-email-account@email.com"
```

**중요**: .env 파일은 환경의 분리 및 보안을 위해 절대로 `git`에 커밋하지 않습니다.

### Database
MySQL(MariaDB) 환경의 DB를 생성하고, 접속 정보를 환경 변수에 입력해주세요.

### npm
사용된 라이브러리를 설치합니다.
```shell script
$ npm i
```


### eslint
`eslint`를 적용하여 코드 스타일을 강제하고 있습니다.
각자가 사용하는 편집기에서 `eslint`실시간으로 체크하도록 플러그인을 설치해서 사용하시길 권합니다.
git 커밋시에 `Staged`된 파일이 자동으로 `eslint`를 거치도록 되어 있습니다. 
