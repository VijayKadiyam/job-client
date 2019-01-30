export default function({$axios, store, redirect}) {
  $axios.onError(error  =>  {
    store.dispatch('validation/setErrors', error.response.data.errors)
  });
  $axios.onRequest(config  =>  {
    let promise = new Promise((resolve, reject) => {
      let user = store.getters['auth/user'];
      let organizations = user ? user.organizations : ''
      let id = organizations.length ? organizations[0].id : '';
      if(!id)
        id = store.getters['settings/organization'].value
      resolve(id)
    });
    promise.then(organizationId => {
      config.headers.common['organization_id'] = organizationId;
      store.dispatch('validation/clearErrors');
    })
  })
}