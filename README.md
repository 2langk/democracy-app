# democracy-app

### Typescript + Express + MySQL(AWS RDS) 기반의 API 서버입니다. 

### 테스트 서버 = AWS EC2 + github action [서버 링크](https://dcrasee.tk/).

### API 문서링크 [Postman 문서링크](https://documenter.getpostman.com/view/12302946/TVt1A5V4).

------------------------
#### 한줄 소개 = 고등학교용 에브리타임(학생회장 선거 플랫폼)

##### 기능 소개
 1. 회원가입 및 로그인(교직원, 학생 분리).  
  교직원은 학교 코드(비밀 코드) 인증 필요, 학생은 학생증 인증 필요.  
  학생의 인증은 담임 교사가 해주는 방식(페이지 별도 존재). 인증 후 인증 이메일 발송.    
  
 2. 입후보 신청, 공약 작성, 투표, 최종 선출.  
  입후보 신청 - 일반 학생이 입후보 신청 후 관리자가 승인.  
  공약 작성 - 후보들만 공약 작성이 가능.   
  선거 기간, 투표 결과 확인, 투표 초기화, 최종 선출등의 기능을 위한 관리자 페이지는 별도 존재.  
  학생들은 선거 기간동안 공약에 투표 가능.  
  이미지(다수) 업로드 가능. 동영상(X)  
  
 3. 게시글 작성(댓글, 대댓글) 및 검색.   
 교육 및 공지 게시판은 관리자만 작성 가능  
 이미지(다수) + 동영상(1개만) 업로드 가능.  
 
 테스트 계정(학교는 2개) 비밀번호는 모두 123123.  
 서울고(665):  
   관리자 = admin1@email.com, 일반 학생 = seoul1@email.com ~ seoul30@email.com  
 경기고(47):   
   관리자 = admin2@email.com 일반 학생 = kyeong1@email.com ~ kyeong30@email.com   
 
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
  - multer 설정
  - logger 등  
  
  
  ##### 배포 계획 = aws ec2 auto scaling. 
  - 프론트  
   = nginx(80, 443) + docker container(express, ejs)  
  - 백엔드  
   = nginx(80, 443) + docker container(express)  
   
