# FAFIA(FRONTEND)

## 目次
1. [概要](#1-概要)
2. [担当したこと](#2-担当したこと)  
    2.1. [手認識機能](#21-手認識機能)  
    ㅤ2.1.1. [指を数える機能](#211-指を数える機能)  
    ㅤ2.1.2. [数えた指の数を確認する機能](#212-数えた指の数を確認する機能)  
    ㅤ2.1.3. [ThumbUpやThumbsDownを認識する機能](#213-thumbupやthumbsdownを認識する機能)  
    2.2. [顔認識機能](#22-顔認識機能)    
    2.3. [勝敗詳細情報](#23-勝敗詳細情報)
---
## 1. 概要
学校のチームプロジェクトで作ったウェブマフィアゲームのBACKEND。

---
## 2. 担当したこと

---
### 2.1. 手認識機能  
* common/detection/hand  
![image](https://user-images.githubusercontent.com/53047744/172786105-7e96c94d-5025-476b-af60-50d3b55322f3.png)  

---
### 2.1.1 指を数える機能  
* common/detection/hand/FingersCount.js  
* common/detection/hand/RightHand.js  
* common/detection/hand/LeftHand.js  
* common/detection/hand/CognitionErrorCheck.js  
 
![image](https://user-images.githubusercontent.com/53047744/172786432-b667b009-cb97-41e3-8a0d-f226dcbc415b.png)  
認識した手の右左を確認  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172789017-ddbdebde-079e-4f17-b5df-35f6e5ab4a3e.png)  
指の節の座標情報を指先の座標情報と比較して、開いている指を判断  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172790842-2eb3c19f-ee62-4283-9186-c869f5c19889.png)  
![image](https://user-images.githubusercontent.com/53047744/172787365-880dba32-4ca9-466a-9022-278bca14ea37.png)  
指を数えるため、手が正しく位置しているかを確認  
正しくない場合、「手を正確に認識させてください。」を表示  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172790514-100e8b10-9003-49c7-b9e7-a4a97de01f4f.png)  
開いている指を数えてreturn  

---
### 2.1.2 数えた指の数を確認する機能
![image](https://user-images.githubusercontent.com/53047744/172795164-82e43572-317c-49f1-b88d-9ca9ff294d25.png)  
認識した手の右左を確認  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172795380-71453c79-a739-4b91-9e4b-de27fa471f2d.png)  
両手の指の座標情報を比較し、「Yes」や「No」をreturn

---
### 2.1.3 ThumbUpやThumbsDownを認識する機能
![image](https://user-images.githubusercontent.com/53047744/172796685-24508956-8756-4e08-b92c-db4f3624bcbc.png)  
認識できる手を一つに制限  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172797180-7473d513-4aed-4204-bf61-49065757d3a9.png)  
親指の座標と小指の座標を比較し、「Up」や「Down」をreturn

---
### 2.2. 顔認識機能
* components/gameFlow_elements/memo.vue
![image](https://user-images.githubusercontent.com/53047744/172802203-a1e11efa-66f6-447d-a0a2-0f12798be303.png)  
自分のvideoの顔を認識して顔の座標を受け取る  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172802655-de60d59c-c4b4-4382-b0e1-adecd352850c.png)  
自分の顔の座標情報をBACKENDに送信  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172802912-b43870e6-2282-4fb4-8248-17bc9e65dafc.png)  
BACKENDからルームメンバーの顔の座標情報を受信  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172803298-4f6ba784-d009-4651-8dc9-f4d69bdfe72d.png)  
![image](https://user-images.githubusercontent.com/53047744/172797663-9a038882-d008-4bb5-9394-30e4c530c043.png)  
ルームメンバーの顔の座標情報を出力  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172822235-22172ff7-cd4c-4e06-a448-bd8bfd164a50.png)  
![image](https://user-images.githubusercontent.com/53047744/172822267-834b7b11-668d-4d86-af6c-d2d608e52b08.png)  
videoをクリックするとメモできるmenuが出る  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172823531-2328bbdf-cd09-405a-9ee9-7613583adf29.png)  
メモすると該当するイメージを入れる  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172824093-d1eeba5b-13f2-4ae2-9903-a58b703edc97.png)  
該当ユーザーの顔の座標情報があれば、顔の上にイメージを表示して、帽子をかぶせる。  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172824405-35ae7b54-86b4-472c-b781-5c947b025ef5.png)  
該当ユーザーの顔の座標情報がなければ、画面の上にイメージを表示  

---
### 2.3. 勝敗詳細情報
* api/mafiaAPI.js  
![image](https://user-images.githubusercontent.com/53047744/172826128-e54e82d3-9b35-4cd5-b25d-85f1dd78954d.png)  
勝敗詳細情報と勝ち負け回数のAPI  
ㅤ  
* store/user.js  
![image](https://user-images.githubusercontent.com/53047744/172826551-ad281e80-d6bd-499d-8c44-23892e9d52d9.png)  
最初に表示する1ページの情報をrequest  
ㅤ  
![image](https://user-images.githubusercontent.com/53047744/172826758-8b1989a3-a01d-4cf7-b499-a1e29ddef5ef.png)  
無限スクロールで次のページの情報をrequest  
ㅤ  
* components/profile_elements/record.vue  
* components/profile_elements/recordInformation.vue  
![image](https://user-images.githubusercontent.com/53047744/172827111-b85db921-5de2-4955-982a-c0c782ee7088.png)  
詳細情報を表示

---
