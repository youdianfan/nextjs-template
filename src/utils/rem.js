(function (win, document, docEl) {
	function setRem(baseWidth = 750) {
		let dpr = win.devicePixelRatio;
		let currentWidth = docEl.clientWidth;
		let remSize = 0;
		let scale = 0;
		scale = currentWidth / baseWidth;
		remSize = baseWidth / 10;
		remSize = remSize * scale;
		docEl.style.fontSize = remSize + 'px';
		docEl.setAttribute('data-dpr', dpr);
	}
	setRem()

	var remTimer;
	win.addEventListener('resize', function() {
		clearTimeout(remTimer);
		remTimer = setTimeout(setRem, 100);
	}, false);


})(window, document, document.documentElement)


