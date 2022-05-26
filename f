[1mdiff --git a/components/gameFlow_elements/memo.vue b/components/gameFlow_elements/memo.vue[m
[1mindex d397b39..cd6e793 100644[m
[1m--- a/components/gameFlow_elements/memo.vue[m
[1m+++ b/components/gameFlow_elements/memo.vue[m
[36m@@ -160,35 +160,50 @@[m [mexport default {[m
       }[m
     ][m
     */[m
[32m+[m[32m        for (const member of this.$store.state.stream.roomMembers) {[m
[32m+[m[32m          if (member.id === this.myInfo.profile.id) {[m
[32m+[m[32m            if (member.die) {[m
[32m+[m[32m              console.log("face off");[m
 [m
[31m-        const landmarks = await model.estimateFaces(videoElement, false);[m
[31m-        // 자신의 얼굴 랜드마크 확인[m
[31m-        // console.log(landmarks);[m
[31m-        canvasCtx.save();[m
[31m-        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);[m
[31m-        canvasCtx.translate(canvasElement.width, 0);[m
[31m-        canvasCtx.scale(-1, 1);[m
[31m-[m
[31m-        // canvasCtx.fillRect(10, 10, 50, 50);[m
[31m-[m
[31m-        // canvasCtx.drawImage([m
[31m-        //   videoElement,[m
[31m-        //   0,[m
[31m-        //   0,[m
[31m-        //   canvasElement.width,[m
[31m-        //   canvasElement.height[m
[31m-        // );[m
[31m-[m
[31m-        // if (landmarks.length) {[m
[31m-        //   landmarks[0].landmarks.forEach((landmark) => {[m
[31m-        //     canvasCtx.fillRect(landmark[0], landmark[1], 50, 50);[m
[31m-        //   });[m
[31m-        // }[m
[31m-        if (!this.blind) {[m
[31m-          await this.postLandmarks(landmarks);[m
[31m-        }[m
[32m+[m[32m              return;[m
[32m+[m[32m            }[m
[32m+[m
[32m+[m[32m            const landmarks = await model.estimateFaces(videoElement, false);[m
[32m+[m
[32m+[m[32m            // 자신의 얼굴 랜드마크 확인[m
[32m+[m[32m            // console.log(landmarks);[m
[32m+[m[32m            canvasCtx.save();[m
[32m+[m[32m            canvasCtx.clearRect([m
[32m+[m[32m              0,[m
[32m+[m[32m              0,[m
[32m+[m[32m              canvasElement.width,[m
[32m+[m[32m              canvasElement.height[m
[32m+[m[32m            );[m
[32m+[m[32m            canvasCtx.translate(canvasElement.width, 0);[m
[32m+[m[32m            canvasCtx.scale(-1, 1);[m
[32m+[m
[32m+[m[32m            // canvasCtx.fillRect(10, 10, 50, 50);[m
[32m+[m
[32m+[m[32m            // canvasCtx.drawImage([m
[32m+[m[32m            //   videoElement,[m
[32m+[m[32m            //   0,[m
[32m+[m[32m            //   0,[m
[32m+[m[32m            //   canvasElement.width,[m
[32m+[m[32m            //   canvasElement.height[m
[32m+[m[32m            // );[m
[32m+[m
[32m+[m[32m            // if (landmarks.length) {[m
[32m+[m[32m            //   landmarks[0].landmarks.forEach((landmark) => {[m
[32m+[m[32m            //     canvasCtx.fillRect(landmark[0], landmark[1], 50, 50);[m
[32m+[m[32m            //   });[m
[32m+[m[32m            // }[m
[32m+[m[32m            if (!this.blind) {[m
[32m+[m[32m              await this.postLandmarks(landmarks);[m
[32m+[m[32m            }[m
 [m
[31m-        canvasCtx.restore();[m
[32m+[m[32m            canvasCtx.restore();[m
[32m+[m[32m          }[m
[32m+[m[32m        }[m
       };[m
       console.log("videoElement", videoElement);[m
       console.log("myInfo id : ", this.myInfo.profile.id);[m
[1mdiff --git a/components/gameFlow_elements/userVideo.vue b/components/gameFlow_elements/userVideo.vue[m
[1mindex 50be433..9da111d 100644[m
[1m--- a/components/gameFlow_elements/userVideo.vue[m
[1m+++ b/components/gameFlow_elements/userVideo.vue[m
[36m@@ -15,7 +15,7 @@[m
             :src-object.prop.camel="s.stream"[m
             autoplay[m
           ></video>[m
[31m-            <video[m
[32m+[m[32m          <video[m
             v-else-if="s.nickname !== myInfo.profile.nicknam && flag === false"[m
             :ref="'remote' + s.userId"[m
             :id="'remote' + s.userId"[m
[36m@@ -607,8 +607,18 @@[m [mexport default {[m
             canvasCtx.restore();[m
             requestAnimationFrame(media);[m
           } else {[m
[31m-            await hands.send({ image: videoElement });[m
[31m-            requestAnimationFrame(media);[m
[32m+[m[32m            for (const member of this.$store.state.stream.roomMembers) {[m
[32m+[m[32m              if (member.id === this.myInfo.profile.id) {[m
[32m+[m[32m                if (member.die) {[m
[32m+[m[32m                  console.log("hands close");[m
[32m+[m[32m                  hands.close();[m
[32m+[m[32m                  return;[m
[32m+[m[32m                } else {[m
[32m+[m[32m                  await hands.send({ image: videoElement });[m
[32m+[m[32m                  requestAnimationFrame(media);[m
[32m+[m[32m                }[m
[32m+[m[32m              }[m
[32m+[m[32m            }[m
           }[m
         }[m
       };[m
