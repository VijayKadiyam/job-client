<template>
  <section>
    <v-layout row wrap>
      <v-flex xs6 px-4>
        <session></session>
      </v-flex>
      <v-flex xs6 px-4>
        <monthly-attendance-table></monthly-attendance-table>
      </v-flex>
    </v-layout>
  </section>
</template>

<script type="text/javascript">
import Session from '@/components/session.vue'
import MonthlyAttendanceTable from '@/components/monthly-attendance-table.vue'

export default {
  components: {
    Session, MonthlyAttendanceTable
  }
}
</script>