async function fetchPost(url = '') {
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    redirect: 'follow', 
    referrerPolicy: 'no-referrer', 
  }).catch(error=>{
      console.error('Error: ', error)
    });
  return response; 
}
