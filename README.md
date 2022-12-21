# 스피드 테트리스

## 배포주소

https://csh111.github.io/tetris

<br>

## 프로젝트 개요

- 바닐라 자바스크립트를 이용한 웹 게임 구현 토이 프로젝트입니다.
- 방향키, Z 키, space 키로 조작하며 많은 블록을 없애 높은 점수를 얻는것이 게임의 목표입니다.
- 시간제한은 30초이고 블록을 클리어할수록 남은 시간이 증가합니다.

<br>

## 프로젝트 기간

- 2022-07-09 ~ 2022-07-23
  - 게임기능 구현
  
- 2022-12-19 ~ 2022-12-21
  - UI 업데이트 - 테마 컬러, 로고
  - 버그픽스

<br>

## 기술스택 및 라이브러리

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white" /> <img src="https://img.shields.io/badge/Sass-CC6699?style=for-the-badge&logo=sass&logoColor=white">  
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"> 

<br>

## 기능소개

- [게임시작](#게임시작)
- [게임종료](#게임종료)
- [블록클리어(점수 및 시간 추가)](#블록-클리어)




<br>

### 게임시작

<img src="https://user-images.githubusercontent.com/105113833/208918395-75a1b4ad-38b5-4573-bec2-fc24f5705293.gif" alt="drawing" width="600"/>

- start 버튼으로 게임을 시작합니다.
- 유저에게 약간의 준비시간을 주며 ui로 표시됩니다.

<br>

### 블록 클리어
<img src="https://user-images.githubusercontent.com/105113833/208918666-01372a3b-9d23-4b83-aa5d-97c95ee7bef7.gif" alt="drawing" width="600"/>

- 블록을 클리어하면 깜빡이는 시각효과와 함께 점수와 시간이 부여됩니다.

<br>

### 게임종료

<img src="https://user-images.githubusercontent.com/105113833/208918838-dcd5b3ed-9690-433c-a40d-cc8e405a2f8e.gif" alt="drawing" align="left" width="500"/>
<img src="https://user-images.githubusercontent.com/105113833/208918821-84cdc4a5-f01e-46ef-92d4-052d289d1d7b.gif" alt="drawing" width="500"/>

<br>

- 남은시간이 0초가 되거나 블록이 상단까지 쌓일 경우 게임이 종료됩니다.
- 남은시간이 5초 미만일시 붉은색 시간 ui가 표시됩니다.
