<template>
  <section>
    <span class="title">Login Status</span>
    <br><br>
    <v-data-table
      :headers="headers"
      :items="user_logins"
      :loading="loading"
      class="elevation-1"
    >
      <v-progress-linear slot="progress" color="blue" indeterminate></v-progress-linear>
      <template slot="items" slot-scope="props">
        <td>{{ props.index + 1 }}</td>
        <td v-html="props.item.name"></td>
        <td>{{ props.item.login_time }}</td>
        <td>{{ props.item.logout_time }}</td>
        <td>
          <v-btn
            flat
            small
            color="blue"
            @click.stop="props.item.breakDialog = true"
          >
            break details
          </v-btn>

          <v-dialog
            v-model="props.item.breakDialog"
            max-width="290"
          >
            <v-card>
              <v-card-text>
                <h3>Break Details</h3>
                <table>
                  <thead>
                    <tr>
                      <th>Action</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(user_break, b) in props.item.breaks"
                      :key="`user_break${b}`"
                    >
                      <td>{{ user_break.break_type.name }}</td>
                      <td>{{ user_break.start_time }} - {{ user_break.end_time }}</td>
                    </tr>
                  </tbody>
                </table>
              </v-card-text>

              <v-card-actions>
                <v-btn
                  color="green darken-1"
                  flat="flat"
                  @click="props.item.breakDialog = false"
                >
                  OK
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </td>
        <td class="text-xs-left">
          <v-btn flat 
            v-if="props.item.status == 'LIVE'"
            class="green--text"
            small
          >
            LIVE
          </v-btn>
          <v-btn flat 
            v-if="props.item.status == 'LOGGED OUT'"
            class="blue--text"
            small
          >
            LOGGED OUT
          </v-btn>
          <v-btn flat 
            v-if="props.item.status == 'ON BREAK'"
            class="yellow--text"
            small
          >
            ON BREAK
          </v-btn>
          <v-btn flat 
            v-if="props.item.status == 'NOT STARTED'"
            class="red--text"
            small
          >
            NOT STARTED
          </v-btn>
        </td>
      </template>
    </v-data-table>
  </section>
</template>

<script type="text/javascript">
export default {
  name: 'ManageUsersLogins',
  async asyncData({$axios, params}) { 
    let users = await $axios.get(`/user_attendances?search=today`);
    
    return {
      users: users.data.data
    }
  },
  data:() =>  ({
    headers: [
      { text: 'Sr No', value: 'sr_no' },
      {
        text: 'Name',
        align: 'left',
        sortable: false,
        value: 'name'
      },
      { text: 'LogIn Time', value: 'login_time' },
      { text: 'LogOut Time', value: 'logout_time' },
      { text: 'Breaks', value: 'breaks', align: 'left', },
      { text: 'Status', value: 'status', align: 'left', },
    ],
    loading: true,
    user_logins: [],
    break_dialog: false,
    tests: ['hi', 'fi', 'si']
  }),
  mounted() {
    this.users.forEach((user, i) => {
      this.user_logins.push({
        name: `
          ${user.name} 
            <br> 
            ${user.email} [ ${user.roles[0].name} ]
        `,
        login_time: user.user_attendances.length ? user.user_attendances[0].login_time : '-',
        logout_time: user.user_attendances.length ? user.user_attendances[0].logout_time : '-',
        breaks: 
          user.user_attendances.length ?
          (
            user.user_attendances[0].user_attendance_breaks
          )
          :
          [],
        breakDialog: false,
        status: 
          user.user_attendances.length ? 
          (
            user.user_attendances[0].logout_time ? 
            (
              'LOGGED OUT'
            )
            :
            user.user_attendances[0].user_attendance_breaks.length ? 
            (
              user.user_attendances[0].user_attendance_breaks.find(user_break => user_break.end_time == null) ?
              (
                'ON BREAK'
              )
              :
              'LIVE'
            )
            :
            'LIVE'
          ) 
          : 
          'NOT STARTED'
      })
    })
    this.loading = false
  }
}
</script>