function changeModPermissions(event,modName){
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

function banForm(event){
  event.preventDefault();
  let form = document.getElementById('ban-form');
  let user_to_ban = form.querySelector("input[name='username']").value;
  console.log(user_to_ban);
  banUser(user_to_ban);
  return false;
}

function banUser(user_to_ban){
  fetchPost('./mod_access/ban/'+user_to_ban).then(response =>{
    if(response.status === 200){
      console.log('good')
    }
    else{
      response.json().then(message =>{
        console.log(message); 
        var element = document.getElementById('ban-error');       
        element.innerHTML = 'ERROR: ' + message.error;
      })
    }
  })
}

function unbanUser(username){
  fetchPost('./mod_access/unban/'+username).then(response =>{
    if(response.status === 200){
      console.log('good')
    }
    else{
      response.json().then(message =>{
        console.log('bad');        
      })
    }
  })
}