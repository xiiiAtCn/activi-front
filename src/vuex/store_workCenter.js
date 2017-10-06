// import Vue from 'vue'
import axios from 'axios'

export default {
  state: {
    workCenterId: '',
    responsibleType: [],
    workDeskData: [],
    workDeskHead: []
  },

  actions: {
    LOAD_PROJECT_LIST: function ({commit}) {
      axios.get('/api/workCenter/workDesk/listDefine/' + this.state.workCenterId)
        .then(response => {
          commit('SET_PROJECT_HEAD', {list: response.data})
        }, err => { console.error('error:' + err) })
      axios.get('/api/workCenter/workDesk/listData/' + this.state.workCenterId)
        .then(response => {
          commit('SET_PROJECT_LIST', {list: response.data})
        }, err => { console.error('error: ' + err) })
    },
    LOAD_KEY_MAN: function ({commit}) {
      axios.get('/api/workCenter/createPrincipalBo')
        .then(response => { commit('SET_PRES_MAN', {list: response.data}) }, data => {
          console.error('error :' + data)
        })
    }
  },

  mutations: {
    SET_PROJECT_LIST: (state, {list}) => {
      state.workDeskData = list
    },
    SET_PROJECT_HEAD: (state, {list}) => {
      state.workDeskHead = list
    },
    SET_PRES_MAN: (state, {list}) => {
      state.responsibleType = list
    }
  },

  getters: {
    openProjects: state => {
      return state.workDeskData.filter(project => !project.completed)
      // return state.workDeskHead.filter(project => !project.completed)
      // return state.responsibleType.filter(project => !project.completed)
    }
  }
}

