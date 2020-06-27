(() => {
  const [box] = document.getElementsByClassName('message-box');
  const [title] = document.getElementsByClassName('message-box-title');
  const [content] = document.getElementsByClassName('message-box-content');

  function fadeOut() {
    if (this.closing) return;
    this.closing = true;
    const time = +'<%= constants.messageBox.transition * 1000 %>';

    this.style.opacity = 0;
    this.style.top = `${this.offsetTop - this.offsetHeight}px`;
    setTimeout(() => {
      this.style.top = `${this.offsetTop + this.offsetHeight}px`;
      this.parentNode.removeChild(this);
    }, time);
  }

  window.showMessage = ({ Title, Content, Color } = {}) => {
    title.innerHTML = Title;
    content.innerHTML = Content;
    const currBox = box.cloneNode(true);
    if (Color) {
      currBox.style.backgroundColor = Color;
      currBox.style.boxShadow = `0 0 <%= constants.messageBox.shadowSize %> ${Color}`;
    }
    currBox.fadeOut = fadeOut;
    document.body.appendChild(currBox);

    setTimeout(() => (currBox.style.opacity = 1), 5);
    setTimeout(() => currBox.fadeOut(), 5000);
    const [close] = currBox.getElementsByClassName('message-box-close');
    close.onclick = e => e.target.parentNode.fadeOut();
  };
  box.parentNode.removeChild(box);
})();
