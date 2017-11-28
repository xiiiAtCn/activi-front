/**
 * File: d:\productNEW\vue_v2\src\vuex\store_layerData.js
 * Project: d:\productNEW\vue_v2
 * Created Date: 2017-11-27
 * Author: ZhaoPeng
 * -----
 * 上次修改时间: 2017-11-27
 * Modified By: ZhaoPeng
 * -----
 * layer组件数据
 */
import Mutations from './Mutation'
import Action from './Action'
import Vue from 'vue'

export default {
    state: {
        // [{id: 'qwe', top: '123px'}]
        layerArr: [],
        // 用来生成id
        idNum: 0,
        defaultTop: '75px',
        defaultLeft: '12.5%'
    },
    mutations: {
        // 页面添加显示的layer
        addItem (state, {id, top, left}) {
            state.layerArr.push({id: id, top: top, left: left})
            state.idNum++
        },
        // 页面关闭layer
        [Mutations.DEL_LAYER] (state, id) {
            let newArr = state.layerArr.filter(item => item.id !== id)
            Vue.set(state, 'layerArr', newArr)
        },
    },
    actions: {
        [Action.ADD_LAYER] ({commit, getters, state}, {id, topInterval, leftInterval}) {
            commit('addItem', {
                id: id, 
                top: getters.previousLayerTop(id, topInterval),
                left: getters.previousLayerLeft(id, leftInterval)
            })
        }
    },
    getters: {
        // 之前layer的top总和
        previousLayerTop (state) {
            return (id, interval) => {
                if (!id && id !== 0) {
                    return '0px'
                } else {
                    let arrLength = state.layerArr.length
                    if (arrLength === 0) {
                        return `${state.defaultTop} + ${interval}`
                    } else {
                        return `${state.layerArr[arrLength - 1].top} + ${interval}`
                    }
                }
            }
        },
        layerTop (state) {
            return id => {
                let item = state.layerArr.find(item => item.id === id)
                if (!item) {
                    return '0px'
                } else {
                    return item.top
                }
            }
        },
        previousLayerLeft (state) {
            return (id, interval) => {
                if (!id && id !== 0) {
                    return '0px'
                } else {
                    let arrLength = state.layerArr.length
                    if (arrLength === 0) {
                        return `${state.defaultLeft} + ${interval}`
                    } else {
                        return `${state.layerArr[arrLength - 1].left} + ${interval}`
                    }
                }
            }
        },
        layerLeft (state) {
            return id => {
                let item = state.layerArr.find(item => item.id === id)
                if (!item) {
                    return '0px'
                } else {
                    return item.left
                }
            }
        }
    }
}
