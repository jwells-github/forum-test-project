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

function removeCommentToggle(subForumName,commentID, element){
  fetchPost('../../remove/comment/'+subForumName+'/'+commentID).then(response =>{
    if(response.status === 200){
      // do something
    }
    else{
      element.previousSibling.nodeValue = 'Something went wrong, please try again shortly.';
    } 
  });
}
