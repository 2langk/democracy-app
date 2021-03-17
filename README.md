# democracy-app

### Typescript + Express + MySQL(AWS RDS) 기반의 API 서버입니다. 

### 테스트 서버 = AWS EC2 + github action 

### API 문서링크 [Postman 문서링크](https://documenter.getpostman.com/view/12302946/TVt1A5V4).

------------------------
#### 한줄 소개 = 고등학교용 에브리타임(학생회장 선거 플랫폼)  

##### 기능 소개   
 1. 회원가입 및 로그인(교직원, 학생 분리).    
  - 학교당 관리자 아이디는 1개.  
  - 교직원은 학교 코드(고유 코드) 인증 필요, 학생은 학생증 인증 필요.       
    + 학교의 고유코드? 커리어넷 API의 학교 ID 이용. 추가로 가공 예정. ex) 경기고 (47)     
    + 학생 인증? 학생의 경우 인증 전까지 로그인 불가. 담임 교사가 학생증을 보고 승인. 인증 완료시 이메일 발송.     
  
 2. 입후보 신청, 공약 작성, 투표, 최종 선출.    
  **기본적으로 학교마다 게시판이 분리되어야 함!**   
  - 입후보 신청 - 일반 학생이 입후보 신청을 하면 관리자가 승인.    
  - 공약 작성 - 후보들만 공약 작성 가능.      
  - 투표 시작(종료), 투표 결과 확인, 투표 초기화, 최종 선출등의 기능을 위한 관리자 페이지는 별도. 관리자만 접근가능.      
  - 학생들은 선거 기간동안 공약에 투표 가능.     
  - 공약 및 입후보 신청 게시글은 이미지만(다수) 업로드 가능. 동영상(X)     
   
 3. 게시글 작성(댓글, 대댓글) 및 검색.       
  - 교육 및 공지 게시판은 관리자만 작성 가능.       
  - 이미지(다수) + 동영상(1개로 제한) 업로드 가능.   
 
 테스트 계정(학교는 2개) 비밀번호는 모두 123123.   
  - 서울고(665):     
   -> 관리자 = admin1@email.com, 일반 학생 = seoul1@email.com ~ seoul30@email.com   
  - 경기고(47):     
   -> 관리자 = admin2@email.com 일반 학생 = kyeong1@email.com ~ kyeong30@email.com    
  
 테스트 계정 및 테스트 게시글은 puppeteer로 생성.    
   
##### 디렉토리(src) 소개   
 ##### models = DB 모델 + DB 커넥션.     
 - User - 유저 모델.  
   + isAuth로 인증 여부, isVote로 투표 여부 확인.  
   + scope로 인증된 사용자만 쿼리. 패스워드 해쉬화.    
 - Application - 입후보 신청서.  
   + isConclude로 후보자 등록 여부 확인.   
 - Pledge - 공약.  
   + canVote, voteCount로 투표 기능 구현. voteCount는 기본적으로 비공개.   
   + Redis로 캐싱 적용.  
 - Post, Comment, SubComment - 게시글, 댓글, 대댓글   
   + 토론 게시판, 교육 게시판, 공지 게시판은 같은 모델을 사용. category로 분리.  
 - 이행도 평가      
   + 당선인의 공약에 대한 평가. 개발중.   
   
 메인 DB는 MySQL이며 ORM으로 sequelize를 사용.  
 Redis는 캐싱을 위해 일부분만 사용.    
 index로 school을 사용.  
 
  ##### routes = 라우터.  
  - url을 분리하기 위함. ~/api/(router).   
  - 모델을 기준으로 라우터를 분류. ex) ~/api/pledge , ~/api/post ...   
  
  ##### controllers = 라우터의 callback 함수 부분.   
  - authController - 로그인, 회원가입, authorization 등 인증 부분. 로그인은 jwt 사용.   
  - applyController - 입후보 신청서 crud, 입후보 승인, 게시판 개폐 등.   
  - pledgeController - 공약 crud, 투표 시작및 종료, 투표, 결과 확인 등.    
  - postController - 게시글(댓글, 대댓글) crud, 게시글 검색.    
  **이미지, 동영상은 aws s3에 업로드 + aws cloudfront(cdn)으로 전송.**  
      
  ##### custom = 커스텀 타입 필요한 것 추가.    
  - ex) req.user, req.file.location ...    
      
  ##### utils = 그 외 기타.   
  - AppError - 에러. isOpertation으로 유저의 실수 혹은 개발자가 던진 에러임을 확인.   
  - globalErrorHandler - express의 에러핸들러 파라미터 4개. production과 development 모드일때 에러처리를 다르게 함.   
  - catchAsync - try catch 대신.  
  - logger - 날짜별로 3가지의 로그(error, info, exception) 기록.     
  - multerConfig - 파일 업로드를 위한 multer의 미들웨어 정리.   
  

