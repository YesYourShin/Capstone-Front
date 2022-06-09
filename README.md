# FAFIA(FRONTEND)

## 目次
1. [槪要](#1-槪要)
2. [担当したこと](#2-担当したこと)  
    2.1. [勝敗結果出力](#21-手認識機能)  
        2.1.1. [指を数える機能](#211-指を数える機能)  
    2.2. [勝ち負け回数出力](#22-顔認識機能)    
        2.1.2. [数えた指の数を確認する機能](#212-数えた指の数を確認する機能)  
    2.3. [顔の座標情報をルームメンバーと共有](#23-勝敗詳細情報)
---
## 1. 槪要
学校のチームプロジェクトで作ったウェブマフィアゲームのBACKEND。

---
## 2. 担当したこと

---
### 2.1. 手認識機能  
* common/detection/hand  
![image](https://user-images.githubusercontent.com/53047744/172786105-7e96c94d-5025-476b-af60-50d3b55322f3.png)  

### 2.1.1 指を数える機能  
![image](https://user-images.githubusercontent.com/53047744/172786432-b667b009-cb97-41e3-8a0d-f226dcbc415b.png)  
認識した手の右左を確認  
![image](https://user-images.githubusercontent.com/53047744/172789017-ddbdebde-079e-4f17-b5df-35f6e5ab4a3e.png)  
指の節の座標情報を指先の座標情報と比較して、開いている指を確認  
![image](https://user-images.githubusercontent.com/53047744/172790842-2eb3c19f-ee62-4283-9186-c869f5c19889.png)  
![image](https://user-images.githubusercontent.com/53047744/172787365-880dba32-4ca9-466a-9022-278bca14ea37.png)  
指を数えるため、手が正しく位置しているかを確認  
正しくない場合、「手を正確に認識させてください。」を表示  
![image](https://user-images.githubusercontent.com/53047744/172790514-100e8b10-9003-49c7-b9e7-a4a97de01f4f.png)  
開いている指を数えてreturn  

### 2.1.2 数えた指の数を確認する機能

---
### 2.2. 顔認識機能


---
### 2.3. 勝敗詳細情報

---
