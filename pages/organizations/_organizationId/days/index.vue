<template>
  <section>
    <span class="title">Manage Days</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/days/create`"
      :color="baseColor"
      title="Add New Day"
      :dark="darkStatus"
    >
      <v-icon>
        add
      </v-icon>
    </v-btn>
   <v-text-field
      v-model="search"
      append-icon="search"
      label="Search"
      single-line
      @keydown.enter="searchDay"
    ></v-text-field>
    <br>
    <v-data-table
      :headers="headers"
      :items="days"
      :pagination.sync="pagination"
      :total-items="totalCount"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td>{{ props.item.name }}</td>
        <td class="text-xs-left">
          <nuxt-link :to="`/organizations/${organization.value}/days/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageDays',
  async asyncData({$axios, params}) { 
    let days = await $axios.get(`/days`);
    return {
      days: days.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Day Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'Action', value: '' }
    ],
    loading: true,
    search: '',
    pagination: {
      rowsPerPage: 5
    },
    totalCount: 0,
  }),
  watch: {
    pagination: {
      async handler () {
        if(this.search == "") {
          this.loading = true
          let days = await this.$axios.get(`/days?page=${this.pagination.page}&rowsPerPage=${this.pagination.rowsPerPage}`);
          this.days = days.data.data
          this.totalCount = days.data.count
          this.pagination.totalItems = days.data.count
          this.loading = false
        }
      },
      deep: true
    }
  },
  methods: {
    async searchDay() {
      if(this.search != "")
      {
        this.loading = true
        let days = await this.$axios.get(`/days?search=${this.search}`);
        this.days = days.data.data
        this.totalCount = days.data.count
        this.pagination.totalItems = days.data.count
        this.loading = false
      }
    }
  }
}
</script>