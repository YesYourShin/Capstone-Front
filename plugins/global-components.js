import Vue from 'vue'
import CreateRoomModal from '@/components/lobby_elements/createRoomModal.vue'

const components = { CreateRoomModal }

Object.entries(components).forEach(([name, component]) => {
  Vue.component(name, component)
})
