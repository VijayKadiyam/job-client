export default function({store, redirect, route}) {
  if(route.name == 'auth-login' || route.name == 'auth-register' || route.name == 'organizations' || route.name == 'profile' || route.name == 'settings' || route.name == 'permissions')
    return;
  
  let user = store.getters['auth/user'];
  let organizations = user ? user.organizations : ''
  let id = organizations.length ? organizations[0].id : '';
  let name = organizations.length ? organizations[0].name : '';
  if(!id) 
    id = store.getters['settings/organization'].value
  else
    store.dispatch('settings/setOrganization', {
      text: name,
      value: id
    })
  if(!id)
  {
    redirect('/settings')
  }
}