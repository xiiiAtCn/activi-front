/**
 * 生成文件树 
 * @author  Lungern xiii.at.cn@gmail.com
 * @since   2017-10-23 13:21:27
 */
const fs = require('fs')
const sysPath = require('path')
let root = sysPath.resolve(__dirname, '../../src')

let fileTree = {
    name: 'src',
    elements:[],
    description: ''
}

function traverse(path, container) {
    let data = fs.readdirSync(path)
    data.forEach(element => {
        let dir = sysPath.resolve(path, element)
        let stat = fs.statSync(dir)
        if(stat.isDirectory()) {
            let ele = {
                name: element,
                elements: [],
                description: ''
            }
            container['elements'].push(ele)
            traverse(dir, ele)
        } else {
            let ele = {
                name: element,
                description: ''
            }
            container['elements'].push(ele)
        }
    })
}
traverse(root, fileTree)
fs.writeFile(sysPath.resolve(__dirname, 'fileTree.json'), JSON.stringify(fileTree), err => {
    if(err) {
        console.error(err.stack)
        return
    }
    console.log('create file successfully')
})

