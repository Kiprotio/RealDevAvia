let isAppInstalled = false;

function open_install_button(btn) {
  let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  let url = "https://github.com/Kiprotio/RealDevAvia/blob/main/AviaBust.apk";
  if (isMobile) {
    btn.innerHTML = `<a href = '${url}' target='_blank'>Open</a>`;
  } else {
    btn.innerHTML = `<a href = '${url}'>Open</a>`;
  }
}

function pseudo_install(count) {
  //console.log(count);
  const installButton = document.getElementById("install");
  if (count < 100) {
    installButton.innerHTML = count + "%";
    setTimeout(pseudo_install, 100, count + 1);
  } else {
    open_install_button(installButton);
    isAppInstalled = true; //finally we are in
  }
}

function check_loaded_apps(btn) {
  if (!("getInstalledRelatedApps" in window.navigator)) {
    console.log("unsupported browser.");
    return;
  }
  (async function () {
    const relatedApps = await navigator.getInstalledRelatedApps();
    console.log(relatedApps);
    if (relatedApps.length > 0) {
      btn.innerHTML = "Open";
      isAppInstalled = true;
    } else {
      isAppInstalled = false;
      btn.innerHTML = "Install";
    }
  })();
}

function is_pwa_supported() {
  return typeof window.onbeforeinstallprompt == "object";
}

function on_load() {
  let installPrompt = null;
  const installButton = document.getElementById("install");

  //assume app is install
  open_install_button(installButton);

  //may take a few seconds
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    installPrompt = event;
    installButton.innerHTML = "Install";
    installButton.addEventListener("click", async () => {
      if (!installPrompt) {
        return;
      }
      const result = await installPrompt.prompt();
      console.log(`Install prompt was: ${result.outcome}`);
      installPrompt = null;
    });
  });

  window.addEventListener("appinstalled", function (event) {
    //wait 10s for app to be fully installed.
    pseudo_install(0);
  });
}
