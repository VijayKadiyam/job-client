export const state = () => ({
  baseColor: 'blue',
  baseHeight: "50px",
  darkStatus: true,
  organization: {
    value: '',
    text: '',
    time_zone: ''
  },
  mediaUrl: 'http://crm.firststepsolutions.in:8080/storage/'
})

export const getters = {
  baseColor(state) {
    return state.baseColor;
  },
  baseHeight(state) {
    return state.baseHeight;
  },
  darkStatus(state) {
    return state.darkStatus;
  },
  organization(state) {
    return state.organization;
  },
  mediaUrl(state) {
    return state.mediaUrl;
  }
}

export const mutations = {
  SET_ORGANIZATION(state, organization) {
    state.organization = organization
  }
}

export const actions = {
  setOrganization({commit}, organization) {
    commit('SET_ORGANIZATION', organization);
  }
}