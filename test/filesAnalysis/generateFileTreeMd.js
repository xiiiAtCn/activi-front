/**
 * 根据json生成xml文档 
 * @author  Lungern xiii.at.cn@gmail.com
 * @since   2017-10-23 14:12:06
 */
function XMLNode(name, content) {
    this.name = name
    if(Object.prototype.toString.apply(content) === '[object Array]')
        this.content = content.slice()
    else 
        this.content =content? [content]:[]
}

XMLNode.prototype.addContent = function(content) {
    if(Object.prototype.toString.apply(content) === '[object Array]')
        this.content = this.content.concat(content)
    else 
        this.content.push(content)
}

XMLNode.prototype.generateText = function() {
    let str = `<${this.name}>\n`
    str += this.content.map(element => {
        if(element instanceof XMLNode) {
            return element.generateText()
        } else {
            return element.toString()
        }
    }).join('\n')
    str += `\n</${this.name}>`
    str 
    return str
}

module.exports = XMLNode

const fileTree = require('./fileTree.json')
const fs = require('fs')
const path = require('path')
function buildTree(obj) {
    let node
    if(obj.elements && obj.elements.length > 0) {
        let leaf = new XMLNode('summary', obj.name)
        node = new XMLNode('details', leaf)
        let dl = new XMLNode('dl')
        node.addContent(dl)
        obj.elements.forEach(element => {
            let dd = new XMLNode('dd', buildTree(element))
            dl.addContent(dd)
        })
    } else {
        node = obj.name
    }
    return node
}

let result = buildTree(fileTree).generateText()
fs.writeFile(path.resolve(__dirname, '../../Z.document/项目结构.md'), result, err => {
    if(err) {
        console.log(err.stack)
    }
    console.log('success')
})