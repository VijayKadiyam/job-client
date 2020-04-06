<template>
  <section>
    <span class="title">Manage Practices</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/practices/create`"
      :color="baseColor"
      title="Add New Practice"
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
      @keydown.enter="searchPractice"
    ></v-text-field>
    <br>
    <v-data-table
      :headers="headers"
      :items="practices"
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
          <nuxt-link :to="`/organizations/${organization.value}/practices/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManagePractices',
  async asyncData({$axios, params}) { 
    let practices = await $axios.get(`/practices`);
    return {
      practices: practices.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Practice Name',
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
          let practices = await this.$axios.get(`/practices?page=${this.pagination.page}&rowsPerPage=${this.pagination.rowsPerPage}`);
          this.practices = practices.data.data
          this.totalCount = practices.data.count
          this.pagination.totalItems = practices.data.count
          this.loading = false
        }
      },
      deep: true
    }
  },
  methods: {
    async searchPractice() {
      if(this.search != "")
      {
        this.loading = true
        let practices = await this.$axios.get(`/practices?search=${this.search}`);
        this.practices = practices.data.data
        this.totalCount = practices.data.count
        this.pagination.totalItems = practices.data.count
        this.loading = false
      }
    }
  }
}
</script>