<template>
  <section>
    <span class="title">Manage Data</span>
    <v-btn
      small
      fab
      to='/manage-data/questions/create'
      :color="baseColor"
      title="Add New Question"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageData'
}
</script>

<style type="text/css" scoped>

</style>