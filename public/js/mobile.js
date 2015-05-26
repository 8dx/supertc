$(function() {
	    var loc = document.location.href;
	    window.socket = io(loc);
	    socket.on('news', function (data) {
	      console.log(data);
	      socket.emit('my other event', { my: 'data' });
	    });
	function initiateRTC() {
		var gm = Modernizr.prefixed('getUserMedia',navigator);
		var actx = new webkitAudioContext();
		var cctx = document.getElementById("cur_frame").getContext('2d');
		cctx.font = '32px Raleway';
		var gradient = cctx.createLinearGradient(0,0,document.getElementById('cur_frame').width,0);
		gradient.addColorStop("0","magenta");
		gradient.addColorStop("0.5","blue");
		gradient.addColorStop("1.0","red");
		cctx.fillStyle = gradient;
		var video = document.getElementById('live_video');
		gm({video: {
					mandatory: {
						maxWidth: 300,
						maxHeight: 300
					}
				}, audio: false},
			function(stream) {
				socket.emit('rtcbegin', {new: true, random: Math.random()});
				//var mic = actx.createMediaStreamSource(stream);
				//mic.connect(actx.destination);
				video.src = window.webkitURL.createObjectURL(stream);
				$("#textlayer").fadeIn();
				$("#canvas_text").submit(function(e) {
					txt = $("#textlayer").val();
					socket.emit('message', { data: txt});
					e.preventDefault();
					$("#cur_frame").data("text",txt);
					$("#textlayer").val("");
					return false;
				});
				(function(vid) {
					setInterval(function() {
						cctx.drawImage(vid,0,0);
						if(!!$("#cur_frame").data("text")) {
							cctx.fillText($("#cur_frame").data("text"),10,40);
						}
					},1);
				})(video);
			}, function(error) { console.log(error); }
		);
	}
	$("#rtc").click(initiateRTC);
})
