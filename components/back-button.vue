<template>
  <v-btn
    small
    fab
    :color="baseColor"
    :to="link"
    :title="title"
    :dark="darkStatus"
  >
    <v-icon>
      arrow_back
    </v-icon>
  </v-btn>
</template>

<script type="text/javascript">

export default {
  props: [
    'title', 'link'
  ]
}
</script>