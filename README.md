# democracy-app

### Typescript + Express + MySQL(AWS RDS) 기반의 API 서버입니다. 

### 테스트 서버 = AWS EC2 + github action [서버 링크](http://ec2-13-124-175-42.ap-northeast-2.compute.amazonaws.com).

### API 문서링크 [Postman 문서링크](https://documenter.getpostman.com/view/12302946/TVt1A5V4).

------------------------

##### 기능 소개
 1. 회원가입 및 로그인(교직원, 학생 분리).
 2. 입후보 신청, 공약 작성, 투표, 최종 선출.
 3. 게시글 작성(댓글, 대댓글).
 
 백엔드 개발은 70% 정도 진행되었고 프론트랑 연동도 시작했습니다.  
 
 테스트 계정 kimt@email.com // 123123  
 회원가입용 학교 = 서울고 // 665 (학교명 // 코드)
 
##### 디렉토리 소개  
 ##### models = DB 모델 + DB 커넥션.  
 - 유저
 - 입후보 신청서
 - 공약
 - 게시글, 댓글, 대댓글  
 - 이행도 평가    
    
  -> 메인 DB는 MySQL이며 ORM으로 sequelize를 사용.  
  -> Redis는 캐싱을 위해 일부분만 사용.    
  -> index로 school을 사용.  
 
  ##### routes = 라우터.  
  - 모델을 기준으로 라우터를 분류.
  
  ##### controllers = 라우터의 callback 함수 부분.
  - pledge만 캐싱.    
  - auth는 jsonwebtoken 이용.
  - 이미지, 동영상은 aws s3에 업로드 + aws cloudfront(cdn)으로 전송.
  
  ##### custom = 커스텀 타입.  
    
  ##### utils = 그 외 기타.  
  - 에러처리
  - multer설정
  - logger 등  
  
  
  ##### 배포 계획 = aws ec2 auto scaling. 
  - 프론트  
   = nginx(80, 443) + docker container(express, ejs)  
  - 백엔드  
   = nginx(80, 443) + docker container(express)  
