function removePostToggle(subForumName, postID, element){
  fetchPost('../../remove/post/'+subForumName+'/'+postID).then(response =>{
    if(response.status === 200){
      toggleClass(element.parentNode.parentNode.parentNode, 'delete-hide'); 
    }
    else{
      element.previousSibling.nodeValue = 'Something went wrong, please try again shortly.';
    } 
  });
}

function removeCommentToggle(subForumName,commentID, reinstateComment, element){
  fetchPost('../../remove/comment/'+subForumName+'/'+commentID).then(response =>{
    if(response.status === 200){
      toggleClass(element.parentNode, 'active');
      if(reinstateComment){
        document.getElementById('action-message').innerHTML = 'Comment Reinstated'
      }
      else{
        document.getElementById('action-message').innerHTML = 'Comment Removed'
      }
      
    }
    else{
      element.previousSibling.nodeValue = 'Something went wrong, please try again shortly.';
    } 
  });
}
