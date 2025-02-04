
/*
var pan1_1_1 = document.getElementById('video-pan1-1');
  var videoSrc = pan1_1_1.src;
console.log(videoSrc);
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(pan1_1_1);
  }
  
  else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
  }
*/
const videoElements = document.querySelectorAll('.rightcolvideo');

for(let i=0; i< videoElements.length; i++){
  let id = videoElements[i].id;
  let source = videoElements[i].src;
  if (Hls.isSupported()) {
    var hls = new Hls();
    hls.loadSource(source);
    hls.attachMedia(videoElements[i]);
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoSrc;
  }

}



 // console.log('----------------->', ids);
  