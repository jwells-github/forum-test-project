async function fetchPost(url = '', data ={}) {
  console.log(url);
  const response = await fetch(url, {
    method: 'POST', 
    mode: 'cors', 
    cache: 'no-cache', 
    credentials: 'same-origin',
    redirect: 'follow', 
    referrerPolicy: 'no-referrer',
    headers: {
      'Content-Type': 'application/json'
    },    
    body: JSON.stringify(data)
  }).catch(error=>{
      console.error('Error: ', error)
    });
  return response; 
}
