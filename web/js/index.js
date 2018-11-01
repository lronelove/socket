// 显示消息提示，隔一段时间小时
(() => {
  const messageBox = document.getElementById('messageBox')
  let { title, content, url, audio } = { title: 'title', content: 'this is a information', audio: './hello.mp3' }
  let div = document.createElement('div')
  let messageHtml = `
  <div class="message-box">
    <p class="p1">${title}</p>
    <p class="p2">${content}</p>
    <audio class="audio" src="${audio}"></audio>
  </div>`
  div.innerHTML = messageHtml
  messageBox.appendChild(div)

  let timer = setTimeout(() => {
    messageBox.removeChild(div)
  }, 3000)
})()