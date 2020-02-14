if (!window.node){
  window.node = {
    ipcRenderer: {sendSync(){}},
    path: {},
    fs: {}
  }
}

export default window.node.path;
