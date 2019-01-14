export const state = () => ({
  baseColor: '#D3D3D3',
  baseHeight: "50px"
})

export const getters = {
  baseColor(state) {
    return state.baseColor;
  },
  baseHeight(state) {
    return state.baseHeight;
  }
}