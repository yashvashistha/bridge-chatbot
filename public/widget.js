; (() => {
    const iframe = document.createElement("iframe")
    iframe.src = "https://gami-eta.vercel.app/widget"
    iframe.id = "gami-chatbot-iframe"

    iframe.style.cssText = `
          position: fixed;
          bottom: 20px;
          right: 20px;
          width: 400px;
          height: 100px;
          border: none;
          z-index: 10000;
          background: transparent;
          pointer-events: auto;
      `

    document.body.appendChild(iframe)

    window.addEventListener("message", (event) => {
        if (event.origin !== "https://gami-eta.vercel.app") return

        if (event.data.type === "WIDGET_STATE_CHANGE") {
            const { isOpen } = event.data

            if (isOpen) {
                iframe.style.cssText = `
                          position: fixed;
                          bottom: 20px;
                          right: 20px;
                          width: 100vw;
                          height: 100vh;
                          border: none;
                          z-index: 10000;
                          background: transparent;
                          pointer-events: auto;
                      `
            } else {
                iframe.style.cssText = `
                      position: fixed;
                      bottom: 20px;
                      right: 20px;
                      width: 400px;
                      height: 100px;
                      border: none;
                      z-index: 10000;
                      background: transparent;
                      pointer-events: auto;
                  `
            }
        }
    })

    document.addEventListener("click", (event) => {
        const iframe = document.getElementById("gami-chatbot-iframe")
        if (!iframe) return

        const isOpen = iframe.style.width === "100vw" && iframe.style.height === "100vh"
        
        if (isOpen && !iframe.contains(event.target)) {
            iframe.contentWindow.postMessage({ type: "CLOSE_WIDGET" }, "*")
        }
    })

})()
