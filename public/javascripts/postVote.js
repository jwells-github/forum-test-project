function upvotePost(postID, element){
  fetchPost('../../vote/post/'+postID+'/1').then(response =>{
    if(response.status === 200){
      console.log('success')
    }
    else{
      console.log('fail')
    } 
  });
}

function downvotePost(postID, element){
  fetchPost('../../vote/post/'+postID+'/0').then(response =>{
    if(response.status === 200){
      console.log('success')
    }
    else{
      console.log('fail')
    }
  });
}
