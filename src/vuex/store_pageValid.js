/**
 * Created by sunb on 17-7-5.
 */

// 放画面检验结果的
// var errorItemMap = {}

import _ from 'lodash'

export default {
  state: {
    errorItemMap: {},
    valid: 'NOVALID'
  },
  mutations: {

    VALID: (state) => {
      state.valid = 'VALID'
    },
    INVALID: (state) => {
      state.valid = 'INVALID'
    },
    NOVALID: (state) => {
      state.valid = 'NOVALID'
    },
    DELETE: (state, id) => {
      _.unset(state.errorItemMap, id)
      if (_.isEmpty(state.errorItemMap)) {
        state.valid = 'VALID'
      }
    },
    PUT: (state, id) => {
      state.errorItemMap[id] = id
    }
  },
  actions: {
    initValidStatus: function ({commit}) {
      commit('NOVALID')
    },
    reportValid: function ({commit}, args) {
      if (args.result === true) {
        commit('DELETE', args.id)
      } else {
        // errorItemMap[args.id] = args.id;
        commit('PUT', args.id)
        commit('INVALID')
      }
    }
  }
}
