function upvoteComment(commentID, element){
  fetchPost('../../vote/comment/'+commentID+'/1').then(response =>{
    if(response.status === 200){
      console.log('success')
    }
    else{
      console.log('fail')
    } 
  });
}

function downvoteComment(commentID, element){
  fetchPost('../../vote/comment/'+commentID+'/0').then(response =>{
    if(response.status === 200){
      console.log('success')
    }
    else{
      console.log('fail')
    } 
  });
}
