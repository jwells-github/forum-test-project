function abc(event,modName){
  event.preventDefault();
  let form = document.getElementById(modName);
  let data = {
    mod_name: modName, 
    can_appoint: form.querySelector("input[name='can_appoint']").checked, 
    can_ban: form.querySelector("input[name='can_ban']").checked, 
    can_edit_sub_details: form.querySelector("input[name='can_edit_sub_details']").checked, 
    can_remove: form.querySelector("input[name='can_remove']").checked
  };

  fetchPost('./mod_access/mod_permissions', data).then(response =>{
    if(response.status === 200){
      console.log('yay');
    }
    else{
      response.json().then(message =>{
        document.getElementById(modName+'-error').innerHTML = message.error
        console.log('bad');
      });
    }
  })
  return false;
}