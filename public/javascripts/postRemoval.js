function removePostToggle(subredditName, postID, element){
  fetchPost('../../remove/post/'+subredditName+'/'+postID).then(response =>{
    if(response.status === 200){
      console.log('success');
    }
    else{
      console.log('failure');
    } 
  });
}

function removeCommentToggle(subredditName,commentID, element){
  fetchPost('../../remove/comment/'+subredditName+'/'+commentID).then(response =>{
    if(response.status === 200){
      console.log('success');
    }
    else{
      console.log('failure');
    } 
  });
}
