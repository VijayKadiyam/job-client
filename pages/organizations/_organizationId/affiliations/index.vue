<template>
  <section>
    <span class="title">Manage Affiliations</span>
    <v-btn
      small
      fab
      :to="`/organizations/${organization.value}/affiliations/create`"
      :color="baseColor"
      title="Add New Affiliation"
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
      @keydown.enter="searchAffiliation"
    ></v-text-field>
    <br>
    <v-data-table
      :headers="headers"
      :items="affiliations"
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
          <nuxt-link :to="`/organizations/${organization.value}/affiliations/${props.item.id}`">
            <v-icon>edit</v-icon>
          </nuxt-link>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageAffiliations',
  async asyncData({$axios, params}) { 
    let affiliations = await $axios.get(`/affiliations`);
    return {
      affiliations: affiliations.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Affiliation Name',
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
          let affiliations = await this.$axios.get(`/affiliations?page=${this.pagination.page}&rowsPerPage=${this.pagination.rowsPerPage}`);
          this.affiliations = affiliations.data.data
          this.totalCount = affiliations.data.count
          this.pagination.totalItems = affiliations.data.count
          this.loading = false
        }
      },
      deep: true
    }
  },
  methods: {
    async searchAffiliation() {
      if(this.search != "")
      {
        this.loading = true
        let affiliations = await this.$axios.get(`/affiliations?search=${this.search}`);
        this.affiliations = affiliations.data.data
        this.totalCount = affiliations.data.count
        this.pagination.totalItems = affiliations.data.count
        this.loading = false
      }
    }
  }
}
</script>