# Weaver Framework

## 주 기능

### 개발 환경
- express 기반
- dotenv 를 이용한 환경변수 관리
- 바로 시작할 수 있는 docker 환경 
- eslint 적용 및 규칙
- prettier 규칙
- React Frontend 사용 (개발중)

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
- 국제화 기능(i18n) (개발중)

updated_at: 2020-01-09


## 처음 프로젝트를 받았을 때

### 환경변수
`.env` 복사 후 필요시 자신의 환경에 맞게 수정
```shell script
$ cp .env-sample .env
```
`JWT_SECRET_KEY`값을 생성해줍니다.
```shell script
ssh-keygen -t rsa -C "your-email-account@email.com"
```

**중요**: .env 파일은 환경의 분리 및 보안을 위해 절대로 `git`에 커밋하지 않습니다.

### Docker
`docker-compose`를 실행하기 위해 도커가 설치되어 있어야합니다. mac 용 도커 설치 클라이언트는 [여기](https://docs.docker.com/docker-for-mac/install/)서 다운 받을 수 있습니다.

`docker-compose`를 실행하여 도커 컨테이너 생성합니다. 이때, `-d`옵션을 사용하면 백그라운드에서 실행됩니다.
최초 실행시엔 환경을 설치하느라 오래 걸리지만, 설치 이후엔 빠르게 실행됩니다.

```shell script
$ docker-compose up -d
```
도커 컨테이너는 `mariaDB`와 `express`를 실행시킵니다. [http://localhost:3000](http://localhost:3000)에서 프로젝트가 제대로 실행되는지 확인해보세요. 

도커를 종료하려면
```shell script
$ docker-compose down
```

`Pro tip`: 도커 컨테이너 및 이미지를 확인, 중지, 삭제하는데 유용한 명령어들.
```shell script
$ docker container ls -a  # 실행중인 도커 컨테이너 목록 확인
$ docker exec -it <CONTAINER ID> /bin/bash  # 특정 컨테이너에 접속
$ docker stop $(docker ps -a -q) # 모든 컨테이너 중지
$ docker rm $(docker ps -a -q) # 모든 컨테이너 삭제
$ docker image ls -a # 설치된 도커 이미지 목록 확인 
$ docker rmi $(docker images -a -q) # 모든 도커 이미지 삭제
```

### npm
프로젝트에 필요한 npm 패키지들을 설치할 때는 버전을 통일하기 위해 도커에 접속해서 실행하는 것이 권장되지만, 크리티컬하진 않습니다.
```shell script
$ docker exec -it <CONTAINER ID> /bin/bash  # 특정 컨테이너에 접속
$ npm i
```

### 데이터베이스 생성 및 관리
데이터베이스 관리를 위해 `docker`에 접속해서 `sequelize-cli` 를 사용합니다.
```shell script
$ docker ps // node:12.13.1  이미지의 <CONTAINER ID> 를 획득
$ docker exec -it <CONTAINER ID> /bin/bash // docker 이미지로 진입
```

이제 `Migration Script`를 실행합니다. 이때, 도커 컨테이너 실행 등으로 `.env`환경에 맞는 디비가 존재해야 합니다. 
```shell script
$ ./node_modules/.bin/sequelize db:migrate
```

기본 데이터들을 `Seeder`를 실행하여 DB에 저장합니다.
```shell script
$ ./node_modules/.bin/sequelize db:seed:all
```

`exit`명령어로 도커 프로세스에서 벗어날 수 있습니다.

이제 프로젝트를 시작할 준비가 되었습니다. 매번 작업을 시작하기 전에 `docker-compose up -d`로 프로젝트고 환경을 시작하고, `docker-compose down`으로 종료합니다.


### eslint & Prettier
`eslint` 및 `Prettier`를 적용하여 일부 코드 스타일을 강제하고 있습니다.
각자가 사용하는 편집기에서 `eslint`실시간으로 체크하도록 플러그인을 설치해서 사용하시길 권합니다.
또한 `Prettier`를 지원하는 플러그인으로 코드를 계속 자동으로 고쳐나가며 개발하실 수 있으며
git 커밋시에 `Staged`된 파일이 자동으로 `Prettier`를 거치도록 되어 있습니다. 
