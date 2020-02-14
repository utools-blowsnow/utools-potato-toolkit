// export default {
//   ipcRenderer: "你好啊",
//   remote: window.remote,
//   clipboard: window.clipboard,
//   shell: window.shell
// }
import router from './router'

window.node.ipcRenderer.send = (name,params)=>{
  if (name === "open"){
    let path = params.path;
    path = path.replace("#/","");
    router.push({
      path: path
    })
  }
  if (name === "close"){
    console.log("close");
    router.push({
      path: "/"
    })
  }
  return true;
}
window.node.ipcRenderer.sendSync = (name,params)=>{
  if (name === "open"){
    let path = params.path;
    path = path.replace("#/","");
    router.push({
      path: path
    })
  }
  if (name === "select-folder"){ //选择目录
    let returnValue;
    return new Promise(resolve => {
      window.node.dialog.showOpenDialog({
        title: "选择文件夹",
        properties: ['openDirectory']
      }).then((result) => {
        if (result.filePaths != 0) {
          returnValue = result.filePaths[0]
        } else {
          returnValue = ''
        }
        resolve(returnValue);
      })
    })
  }
  return true;
}
export const ipcRenderer =  window.node.ipcRenderer;




export const remote =  window.node.remote;
export const clipboard =  window.node.clipboard;
export const shell =  window.node.shell;
