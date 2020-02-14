const { ipcRenderer, remote, clipboard, shell } = require('electron')
const { dialog } = remote
const fs = require('fs')
const path = require('path')
const process = require('child_process')

const dbname = "bl_file_sort";



window.db = {
	set:(name,data)=>{
		var myName = dbname+"_"+name;
		utools.db.remove(myName)
		utools.db.put({
			_id: myName,
			data: data
		})
	},
	get:(name)=>{
		var myName = dbname+"_"+name;
		var datas = utools.db.get(myName);
		console.log("window.db.get", datas);
		if (datas === null || datas===undefined || datas.error){
			datas = {data:[]};
		}
		return datas.data;
	},
	push:(name,data)=>{
		var myName = dbname+"_"+name;
		var datas = window.db.get(name);
		datas.push(data);
		utools.db.remove(myName)
		utools.db.put({
			_id: myName,
			data: datas
		})
		console.log("window.db.put", datas);
	}
}

window.utils = {
  clipboard: {
    writeText: (text) => {
      clipboard.writeText(text)
    }
  },
  showDialog: (type,title,message,buttons,callback) => {
    dialog.showMessageBox({
    type: type,
    title: title,
    message: message,
    buttons: buttons
	},callback);
  },
  showOpenDialog: () => {
    return dialog.showOpenDialog(remote.getCurrentWindow(), { filters: [{ 'name': '图片文件', extensions: ['jpg', 'png', 'gif', 'jpeg'] }], properties: ['openFile'] })
  },
  showMssage:(text,title='utools')=>{
	notifier.notify(
     {
       title: title,
       subtitle: 'utools',
       message: text,
       sound: true,
       wait: true
     },
     function (err, response) {
       if (err) {
         console.log(err)
       }
     }
   )
  },
  openExternal: shell.openExternal,
  readFile:(pathObj)=>{
	  var bitmap = fs.readFileSync(pathObj.path);
	  var file = new File(bitmap,pathObj.name);
	  console.log("readFile",bitmap,file)
	  return file;
  },
  process:()=>{
	  return process;
  },
  spath: {
    sep: path.sep,
    resolve(from,to){
      return path.resolve(from,to);
    }
  },
  file:{
    moveFile(fromPath,toPath){
      let sep = path.sep;
      let index = toPath.lastIndexOf(sep);
      let toPath2 = toPath.substr(0,index);

      console.log("existsSync toPath2",toPath2,fs.existsSync(toPath2));
      if(!fs.existsSync(toPath2)){  //移动到的文件夹不存在自动创建
        fs.mkdirSync(toPath2,{recursive: true});
      }
      fs.renameSync(fromPath, toPath);
    },
  },


}


window.fileSort = function(files){
  let rules = window.db.get("rules");

  let sep = path.sep;
  for(let file of files){
    let name = file.name;
    console.log("for name ",name);
    for(let rule of rules){
      let pattern = new RegExp(rule.pattern);
      if(pattern.test(name)){
        let index = file.path.lastIndexOf(sep);
        let oldPath = file.path.substr(0,index);

        let newPath = path.resolve(oldPath, rule.path) + sep + file.name;

        console.log("移动文件",file.path,newPath);
        try{  //防止未知异常 不报错
          window.utils.file.moveFile(file.path,newPath);
          window.db.push("history",{
            oldPath: file.path,
            newPath: newPath,
            time: new Date().Format("yyyy-MM-dd hh:mm:ss")
          });
        }catch(e){
          utools.showNotification("移动文件发生错误："+e.message);
          console.log(e);
        }
        console.log("验证成功",rule.path,name);
        break;
      }
    }
  }
  utools.showNotification("整理完成");
}

window.node = {
  ipcRenderer, remote, clipboard, shell,dialog,
  fs,path
}
