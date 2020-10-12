function removePostToggle(subForumName, postID,reinstatePost, element){
  fetchPost('../../remove/post/'+subForumName+'/'+postID).then(response =>{
    if(response.status === 200){
      toggleClass(element.parentNode, 'active'); 
      if(reinstatePost){
        element.parentNode.parentNode.nextSibling.innerHTML = 'Post Reinstated'
      }
      else{
        element.parentNode.parentNode.nextSibling.innerHTML = 'Post Removed'
      }
    }
    else{
      element.parentNode.parentNode.nextSibling.innerHTML = 'Something went wrong, please try again shortly.';
    } 
  });
}

function removeCommentToggle(subForumName,commentID, reinstateComment, element){
  fetchPost('../../remove/comment/'+subForumName+'/'+commentID).then(response =>{
    if(response.status === 200){
      toggleClass(element.parentNode, 'active');
      if(reinstateComment){
        element.parentNode.parentNode.parentNode.previousSibling.childNodes[0].innerHTML = 'Comment Reinstated'
      }
      else{
        element.parentNode.parentNode.parentNode.previousSibling.childNodes[0].innerHTML = 'Comment Removed'
      }
      
    }
    else{
      element.parentNode.parentNode.parentNode.previousSibling.childNodes[0].innerHTML = 'Something went wrong, please try again shortly.';
    } 
  });
}
