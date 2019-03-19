<template>
  <section>
    <download-excel
      class   = "btn btn-default"
      :data   = "json_data"
      :fields = "json_fields"
      worksheet = "My Worksheet"
      name    = "filename.xls">
      Download Excel (you can customize this with html code!)
    </download-excel>
  </section>
</template>

<script type="text/javascript">

import Vue from 'vue'

export default {
  mounted() {
    var downloadExcel = require('vue-json-excel')
    Vue.use(downloadExcel)
  }
}
</script>